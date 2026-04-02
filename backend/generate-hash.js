import bcryptjs from 'bcryptjs';

const password = 'WardAdmin@123';
const hash = await bcryptjs.hash(password, 10);
console.log('Correct hash for "WardAdmin@123":');
console.log(hash);