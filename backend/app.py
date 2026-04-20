import time
import hashlib
import bcrypt
import argon2
import blake3
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Common weak passwords for attack simulator
WEAK_PASSWORDS = [
    "123456", "password", "12345678", "qwerty", "12345", 
    "123456789", "football", "1234", "1234567", "dragon",
    "admin", "iloveyou", "welcome", "monkey"
]

def identify_hash_candidates(hash_str):
    hash_str = hash_str.strip()
    length = len(hash_str)
    
    # Priority based formats
    if hash_str.startswith('$argon2'):
        return ['argon2']
    if hash_str.startswith('$2'):
        return ['bcrypt']
    
    candidates = []
    if length == 32:
        candidates.append('md5')
    elif length == 64:
        candidates.extend(['sha256', 'blake3', 'sha3_256'])
    elif length == 96:
        candidates.append('sha384')
    elif length == 128:
        candidates.extend(['sha512', 'blake2', 'scrypt'])
        
    return candidates

@app.route('/hash', methods=['POST'])
def generate_hashes():
    data = request.json
    password = data.get('password', '')
    if not password:
         return jsonify({'error': 'Password required'}), 400
         
    # SHA-256
    sha256_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()
    
    # SHA-384
    sha384_hash = hashlib.sha384(password.encode('utf-8')).hexdigest()

    # SHA-512
    sha512_hash = hashlib.sha512(password.encode('utf-8')).hexdigest()

    # SHA-3 (using 256-bit variant for typical use)
    sha3_hash = hashlib.sha3_256(password.encode('utf-8')).hexdigest()

    # BLAKE2 (using blake2b for 512-bit or blake2s for 256-bit. Let's use blake2b)
    blake2_hash = hashlib.blake2b(password.encode('utf-8')).hexdigest()

    # BLAKE3
    blake3_hash = blake3.blake3(password.encode('utf-8')).hexdigest()

    # bcrypt
    bcrypt_salt = bcrypt.gensalt()
    bcrypt_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt_salt).decode('utf-8')
    
    # Argon2
    ph = argon2.PasswordHasher()
    argon2_hash = ph.hash(password)

    # scrypt
    scrypt_salt = b'hashlab_salt' # In standard usage this would be random per user
    scrypt_hash = hashlib.scrypt(password.encode('utf-8'), salt=scrypt_salt, n=16384, r=8, p=1).hex()
    
    return jsonify({
        'sha256': sha256_hash,
        'sha384': sha384_hash,
        'sha512': sha512_hash,
        'sha3_256': sha3_hash,
        'blake2': blake2_hash,
        'blake3': blake3_hash,
        'bcrypt': bcrypt_hash,
        'argon2': argon2_hash,
        'scrypt': scrypt_hash
    })

@app.route('/compare', methods=['POST'])
def compare_algorithms():
    data = request.json
    password = data.get('password', 'default')
    
    # SHA-256 time
    start = time.perf_counter()
    for _ in range(100):
        pass
    start = time.perf_counter()
    hashlib.sha256(password.encode('utf-8')).hexdigest()
    sha256_time = (time.perf_counter() - start) * 1000 # ms

    # SHA-384
    start = time.perf_counter()
    hashlib.sha384(password.encode('utf-8')).hexdigest()
    sha384_time = (time.perf_counter() - start) * 1000 

    # SHA-512
    start = time.perf_counter()
    hashlib.sha512(password.encode('utf-8')).hexdigest()
    sha512_time = (time.perf_counter() - start) * 1000 

    # SHA-3 (256)
    start = time.perf_counter()
    hashlib.sha3_256(password.encode('utf-8')).hexdigest()
    sha3_time = (time.perf_counter() - start) * 1000 

    # BLAKE2
    start = time.perf_counter()
    hashlib.blake2b(password.encode('utf-8')).hexdigest()
    blake2_time = (time.perf_counter() - start) * 1000 

    # BLAKE3
    start = time.perf_counter()
    blake3.blake3(password.encode('utf-8')).hexdigest()
    blake3_time = (time.perf_counter() - start) * 1000 
    
    # bcrypt time
    start = time.perf_counter()
    salt = bcrypt.gensalt(rounds=12)
    bcrypt.hashpw(password.encode('utf-8'), salt)
    bcrypt_time = (time.perf_counter() - start) * 1000 # ms
    
    # Argon2 time
    start = time.perf_counter()
    ph = argon2.PasswordHasher()
    ph.hash(password)
    argon2_time = (time.perf_counter() - start) * 1000 # ms

    # scrypt time
    start = time.perf_counter()
    hashlib.scrypt(password.encode('utf-8'), salt=b'hashlab_salt', n=16384, r=8, p=1)
    scrypt_time = (time.perf_counter() - start) * 1000 # ms
    
    return jsonify({
        'sha256': sha256_time,
        'sha384': sha384_time,
        'sha512': sha512_time,
        'sha3_256': sha3_time,
        'blake2': blake2_time,
        'blake3': blake3_time,
        'bcrypt': bcrypt_time,
        'argon2': argon2_time,
        'scrypt': scrypt_time
    })

@app.route('/argon2-playground', methods=['POST'])
def argon2_playground():
    data = request.json
    password = data.get('password', 'default')
    time_cost = int(data.get('time_cost', 2))
    memory_cost = int(data.get('memory_cost', 102400)) # Default 100MB
    parallelism = int(data.get('parallelism', 8))
    
    try:
        ph = argon2.PasswordHasher(
            time_cost=time_cost, 
            memory_cost=memory_cost, 
            parallelism=parallelism
        )
        start = time.perf_counter()
        ph.hash(password)
        duration = (time.perf_counter() - start) * 1000
        return jsonify({'time_ms': duration})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/simulate-attack', methods=['POST'])
def simulate_attack():
    data = request.json
    target_hash = data.get('target_hash', '').strip()
    algorithm = data.get('algorithm', 'sha256').lower()
    custom_wordlist = data.get('custom_wordlist', [])

    if not target_hash:
        return jsonify({'error': 'target_hash is required'}), 400

    words_to_check = custom_wordlist if custom_wordlist else WEAK_PASSWORDS
    words_to_check = words_to_check[:500]

    if algorithm == 'auto':
        candidates = identify_hash_candidates(target_hash)
        if not candidates:
            return jsonify({'error': 'Could not identify hash format. Please specify algorithm manually.'}), 400
        
        # Try each candidate
        total_log = []
        for cand in candidates:
            total_log.append({'word': f'--- Trying detected algorithm: {cand} ---', 'hash': '', 'status': 'INFO', 'found': False})
            
            # Re-run simulation logic for this candidate
            # (In a cleaner app we'd refactor the core logic, but for simplicity here we just nest or re-call)
            res = _run_crack_logic(target_hash, cand, words_to_check)
            total_log.extend(res['log'])
            
            if res['found']:
                return jsonify({
                    'log': total_log,
                    'cracked': True,
                    'cracked_password': res['password'],
                    'detected_algorithm': cand,
                    'time_ms': 0 # Time is complex to sum across increments here but let's just return what we have
                })
        
        return jsonify({
            'log': total_log,
            'cracked': False,
            'detected_algorithm': 'none',
            'time_ms': 0
        })

    # Non-auto mode
    res = _run_crack_logic(target_hash, algorithm, words_to_check)
    return jsonify({
        'log': res['log'],
        'cracked': res['found'],
        'cracked_password': res['password'],
        'time_ms': 0
    })

def _run_crack_logic(target_hash, algorithm, words):
    log = []
    found = False
    password = None
    
    ph = None
    if algorithm == 'argon2':
        ph = argon2.PasswordHasher()

    for word in words:
        word_hash = ''
        match = False

        if algorithm == 'sha256':
            word_hash = hashlib.sha256(word.encode('utf-8')).hexdigest()
            match = word_hash == target_hash
        elif algorithm == 'sha384':
            word_hash = hashlib.sha384(word.encode('utf-8')).hexdigest()
            match = word_hash == target_hash
        elif algorithm == 'sha512':
            word_hash = hashlib.sha512(word.encode('utf-8')).hexdigest()
            match = word_hash == target_hash
        elif algorithm == 'sha3_256':
            word_hash = hashlib.sha3_256(word.encode('utf-8')).hexdigest()
            match = word_hash == target_hash
        elif algorithm == 'blake2':
            word_hash = hashlib.blake2b(word.encode('utf-8')).hexdigest()
            match = word_hash == target_hash
        elif algorithm == 'blake3':
            word_hash = blake3.blake3(word.encode('utf-8')).hexdigest()
            match = word_hash == target_hash
        elif algorithm == 'md5':
            word_hash = hashlib.md5(word.encode('utf-8')).hexdigest()
            match = word_hash == target_hash
        elif algorithm == 'scrypt':
            word_hash = hashlib.scrypt(word.encode('utf-8'), salt=b'hashlab_salt', n=16384, r=8, p=1).hex()
            match = word_hash == target_hash
        elif algorithm == 'bcrypt':
            try:
                match = bcrypt.checkpw(word.encode('utf-8'), target_hash.encode('utf-8'))
                word_hash = "bcrypt compare"
            except Exception:
                match = False
            
        elif algorithm == 'argon2':
            try:
                ph.verify(target_hash, word)
                match = True
                word_hash = "argon2 verify ok"
            except Exception:
                match = False

        if match:
            log.append({
                'word': word,
                'hash': word_hash[:20] + '...' if len(word_hash) > 20 else word_hash,
                'status': 'CRACKED',
                'found': True
            })
            found = True
            password = word
            break
        else:
            log.append({
                'word': word,
                'hash': word_hash[:20] + '...' if len(word_hash) > 20 else word_hash,
                'status': 'FAILED',
                'found': False
            })
            
    return {'log': log, 'found': found, 'password': password}

@app.route('/analyze', methods=['GET', 'POST'])
def analyze_password():
    password = ""
    if request.method == 'POST':
        data = request.json or {}
        password = data.get('password', '')
    else:
        password = request.args.get('password', '')
        
    if not password:
        return jsonify({'score': 0, 'label': 'None', 'color': 'bg-white/10'})
        
    score = 0
    if len(password) > 8: score += 1
    if len(password) > 12: score += 1
    if any(c.isupper() for c in password): score += 1
    if any(c.isdigit() for c in password): score += 1
    if any(not c.isalnum() for c in password): score += 1

    patterns = ['123', 'password', 'qwerty', 'admin', 'abc']
    if any(p in password.lower() for p in patterns):
        score = max(0, score - 2)

    if score <= 2:
        return jsonify({'score': 33, 'label': 'Weak 🔴', 'color': 'bg-red-500'})
    elif score in (3, 4):
        return jsonify({'score': 66, 'label': 'Medium 🟡', 'color': 'bg-yellow-500'})
    else:
        return jsonify({'score': 100, 'label': 'Strong 🟢', 'color': 'bg-green-500'})

@app.route('/', methods=['GET'])
def index():
    return jsonify({"status": "HashLab Pro API is running"}), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
