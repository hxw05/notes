---
date: 2026/05/10
---

# 使用 Hermes Agent — Day 2

今天让Hermes Agent帮我完成了一个平常需要费很大力气去Google一圈才能完成的操作——在macOS上面信任一个PKCS12密钥库中的自签名证书。说要费很大力气是因为在我的印象中这类（openssl等）指令的参数都很多且含义复杂，一时半会搞不清楚而且一般也用不上而且记了也没用...所以我寻思不如让Hermes Agent帮我搞。

还解决了在命令行能用`websocat`连而在Chrome里面就被拒绝的问题。

最初是DeepSeek在Claude Code里面给的一个生成步骤：
```sh
keytool -genkeypair \
-alias seatool \
-keyalg RSA \
-keysize 2048 \
-validity 365 \
-keystore keystore.p12 \
-storetype PKCS12 \
-storepass changeit \
-keypass changeit \
-dname "CN=127.0.0.1, OU=Dev, O=[项目名称], L=, ST=, C="
```

确实能生成出密钥库文件来，但是怎么让macOS信任是一个问题——这个格式不是一般见到的crt和pem，而是一个库的形式。

搜也搜不到，于是就让Hermes给我办了，没想到思路就是转换为一个crt（准确来说，是从库中提取出来）。后面还让Hermes帮忙解决了一个Chrome不认这个已经受信任的密钥的问题：因为原本的密钥只有CN，没有给SAN（Subject Alternative Name），而Chrome要求有SAN。