# คูปองและแอดมิน (รุ่น0.5)

1. เมืองหลัก → ระบบทั้งหมด → แอดมินคูปอง ตั้งรหัสผ่านอย่างน้อย12ตัวอักษรด้วยตนเอง ดาวน์โหลดไฟล์สำรองกุญแจแบบเข้ารหัสและเก็บไว้ส่วนตัว ใช้ไฟล์นี้กับช่องกู้คืนและรหัสผ่านเดิมเพื่อย้ายอุปกรณ์ได้
2. ตั้งชื่อคูปอง วันหมดอายุ และรางวัล (สูงสุด10ไอเทม ไอเทมละ1–1,000,000) กดเพิ่มรายการก่อนสร้าง แล้วคัดลอกรหัสทั้งหมด รหัสเป็นข้อความลายเซ็นยาว ไม่ใช่ชื่อคูปองสั้น ๆ
3. ส่งรหัสพร้อมกุญแจยืนยันสาธารณะและลายนิ้วมือให้ผู้เล่น ผู้เล่นเข้า คูปอง → กุญแจยืนยันของแอดมิน นำเข้าและตรวจลายนิ้วมือครั้งแรก จากนั้นกรอกรหัส ตรวจของรางวัล และยืนยันรับ ผู้สร้างบนเบราว์เซอร์เดียวกันได้รับการตั้งค่ากุญแจยืนยันอัตโนมัติ

ห้ามแจกไฟล์สำรองกุญแจแอดมินหรือรหัสผ่านให้ผู้เล่น ไม่จำเป็นต้องส่งรหัสผ่านให้ผู้พัฒนา ไม่มีรหัสผ่านแอดมินตั้งต้นในโค้ด

## ขอบเขต

ระบบนี้ทำงานออฟไลน์ ไม่มีบัญชีหรือสิทธิ์แอดมินส่วนกลาง ทุกคนสร้างผู้ออกคูปองของตนเองได้ แต่รหัสจะใช้กับเครื่องอื่นได้ต่อเมื่อเครื่องนั้นเชื่อถือกุญแจผู้ออกก่อน ลายเซ็นตรวจว่ารางวัลมาจากกุญแจที่เชื่อถือและไม่ได้ถูกแก้ไข ไม่ได้ป้องกันเจ้าของเครื่องแก้ไขเซฟเกมของตนเอง

รับได้ครั้งเดียวต่อคูปองในเซฟเบราว์เซอร์ปัจจุบัน การลบ/รีเซ็ตเซฟจะล้างประวัติ การหมดอายุใช้เวลาของอุปกรณ์ ไม่มีจำกัดจำนวนใช้รวมทุกคน ไม่มีเพิกถอนคูปองจากส่วนกลาง ไม่ซิงก์ประวัติหรือกุญแจข้ามเครื่องอัตโนมัติ ระบบเหล่านี้ต้องมีบริการเซิร์ฟเวอร์และบัญชีผู้เล่นเพิ่ม

รางวัลเพิ่มไอเทมในกระเป๋าโดยตรง ไอเทมที่ต้องใช้ระบบซึ่งเว็บยังไม่รองรับจะอยู่ในกระเป๋าโดยยังใช้ไม่ได้

## Implementation and validation

Web Crypto ECDSA P-256/SHA-256 signatures; private key encrypted using PBKDF2-SHA-256 (310,000 iterations, random16-byte salt) and AES-256-GCM (random12-byte IV). Public issuer fingerprints use SHA-256. Passphrase is entered locally, not embedded or transmitted. Keys are encrypted in a separate localStorage record; private keys are not exported in the public coupon. Explicit lock/navigation clears the unlocked UI; encrypted backup restore requires its passphrase.

Validation:22 model tests pass, including wrong-password rejection, signature tampering, unknown issuer, expiry, duplicate rewards, unknown items, repeated claims and inventory overflow. Production build tested under /game-build/: separate browser contexts for admin and recipient, explicit key trust, reward grant, reload/replay rejection, and360/390/720/1440 layouts. See release-0.5-validation.json.
