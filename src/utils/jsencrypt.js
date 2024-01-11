import JSEncrypt from 'jsencrypt';

// 加密
export function getEncryCode(str) {
  const jse = new JSEncrypt();

  const pubKey = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUDogpslAbLYUhBOGc3T928j8KU0BomMEzgKfQGFRUNrSZl83Or+/CqktPNB+QnsZd2+YQ1SATQoS3lIGuOmkFFkJTe/iydARMk7OPzLah3lfPANHflphN5gNUFzv8ydak2Ja9m+ult6s0tLTrBKUBXMmVST2TcBwXHfpuG7Sa3wIDAQAB`;

  jse.setPublicKey(pubKey);
  const data = jse.encrypt(str.toString());
  return data;
}

// 解密
export function sendEncryCode(params) {
  const jse = new JSEncrypt();

  const privKey = `-----BEGIN ENCRYPTED PRIVATE KEY-----
    MIICxjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQI0GMjrFNwVx4CAggA
    MBQGCCqGSIb3DQMHBAghQPAuRe8TAgSCAoBNl0iYnwmsX9MMdSzKwAze2EQgRJZI
    lvdJtYlmdNHWC83LBIojnl7Q0jwxU2PFWbggM+iuLtT9XNqMvYU5gKCfHWdmr3RK
    jrPuXgieVhZf/7fo5bVQsO6ZfPc+57rGL5eRp15o0/pp4VWb2FjlS3v0DLJ9cbLA
    gpfZM4Vb6PPHA92do+wrEX/WtP6WBwmXK5lz9VLiBKCbwsz7EeWowXxp1Stm1nP5
    fyNefrKT4uvCi95tZ9Hd8ocq5HN8GRWz1aG8q+3kH7TkZza5Yy0W+PQAsCFzYypQ
    Tu7D7BMLtZdaz7gidQnvpBLH+wFqZSHYkHjkDDyt5XUuhNuS8gmZTIqtbNDYka9s
    qMmFO7qKkKga2geWiCA63u3t9Jwb5bxMJWVZoW5SvlCuZ0v01JINXxyx/y4R/48Q
    dowRTfRUB5LooZYUqAl0CmWoAOHEaysqE8+Yj52pGrKeOPbhOJY0Ty9QM4OAQn1r
    DKxtR+7HYawr8t5+Rg+QNJPtpnaZ73cM3wAzD7se35HH4UdH4bu+4HTyl6p4nxd1
    c3NOi/InGE7eDCYOILFTKnxVI/YPbr4tai9U7j+LOcX+Mgn0ULudL0CsDHoLb+2X
    GQ748TGZW4I7etyom8mOliotCh+82N99vnL5MPKSsRlITnm0ahJCCaDio3TJP5Wv
    ewN96ucUzDMu1XOEN4gNWRABLfFIgQ9Zk4vttbFg/xD1BjrQhm/ok/ttc6Ovd1LU
    Kp8Kd4QfqaZLznnmWf3h4f+6w/0g9sQoGYaHtabAT2gldA4FaevTILX+6ev/SZjZ
    /BxilDStBJA/yTJiMkjD0h5DXcqa6zZl40MgCwEpAHCKfYwbPJFssbmp
    -----END ENCRYPTED PRIVATE KEY-----`;

  jse.setPrivateKey(privKey);
  const data = jse.decrypt(params);
  return data;
}
