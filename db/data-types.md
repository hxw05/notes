# MySQL的常见数据类型

## 数值类型

|类型名|大小|约束|备注|
|---|---|---|---|
|TINYINT|1字节|范围：有符号-128-127，无符号0-255|BOOLEAN等价于TINYINT(1)，其中1是指**显示宽度**|
|SMALLINT/MEDIUMINT/INT/BIGINT|2/3/4/8字节||大数据量下使用INT作为自增主键可能存在不够用的情况|
|DECIMAL(M,D)|不定|M<=65, D<=30|相比FLOAT/DOUBLE没有误差|
|FLOAT/DOUBLE|4/8字节||等值比较不是绝对可靠的|
|BIT(M)|$\lceil M/8 \rceil$字节|M<=64||

- INT系列的类型参数（如INT(10)中的10、TINYINT(1)中的1）指的是显示宽度，不会影响该类型的取值范围或大小，从MySQL 8.0.17开始已经废弃（但TINYINT(1)中的1被保留用于判断是否等价于程序设计语言中的布尔型）
- DECIMAL(M,D)中的M称为精度（precision），D称为标度（scale）。精度可以理解为这个数字的**总有有效位数**，标度可以理解为**小数位数**。如DECIMAL(10,2)可以存的最大数为99999999.99。缺省时，M默认值为10，D默认值为0。
- BIT(M)以定长二进制的形式存储数值，M默认值为1。注意：MySQL的最小分配单位是字节，因此BIT(1)也要占据1字节的空间。

## 字符串类型、二进制类型

|类型名|大小|约束|备注|
|---|---|---|---|
|CHAR(N)|由N确定的0-255**字符**||CHAR的值是定长的，若存入数据时不满该长度会补空格，查询的时候会去掉尾部的空格|
|VARCHAR(N)|不定|最大占65535字节|N决定的是逻辑上的字符上限，数据的长度由实际存入的内容决定|
|TINYTEXT/TEXT/MEDIUMTEXT/LONGTEXT|255B/64KB/16MB/4GB||8.0.13前不支持默认值、必须使用前缀索引、排序只取前max_sort_length个字节|
|ENUM|1-2字节|最多65535种枚举|排序时按照定义的顺序而非字面顺序|

- CHAR(N)补空格的行为在不同的引擎、字符集下表现不同，不一定会真的补空格；这里的空格指的0x20字节
- VARCHAR(N)的N除了限制最大字符数之外，还会影响用于记录该列长度信息的大小，该大小在列创建的时候确定。若N<=255，则该长度信息用1字节空间记录；若N>255，则用2字节空间记录
- 在utf8mb4下，单个字符最大占4B，VARCHAR(N)中N的最大限制约16383，以此类推
- 需要注意TEXT的大小介于TINYTEXT与MEDIUMTEXT之间（而MEDIUMINT的大小介于TINYINT和INT之间）

**BINARY(N)/VARBINARY(N)**：与CHAR/VARCHAR类似，但不存在字符集的概念，N表示的是字节数量。BINARY(N)和CHAR(N)在写入时，约定上都会对不满N的数据补一个特定值；而读取时，CHAR会将尾部的空格去掉，BINARY**不会**将尾部的0x00去掉。

|类型|长度不满时约定补值|
|---|---|
|BINARY|0x00|
|CHAR|空格（0x20）|

**BLOB系列和TEXT系列**：其各个级别的容量是一致的，顶层单位一个是字节一个是字符。

**ENUM类型**：ENUM类型适合那些预先确定的枚举，例如admin/operator/guest、low/medium/high等，其灵活性比VARCHAR差（如果需要修改枚举，需要ALTER TABLE），但因其实际存储的是整数，存储效率和查询效率都比字符串要好。

## 日期时间类型

|类型名|大小|范围|备注|
|---|---|---|---|
|DATE|3字节|1000-01-01 - 9999-12-31|时区无关|
|DATETIME|5字节|1000-01-01 00:00:00 - 9999-12-31 23:59:59|时区无关|
|TIMESTAMP|4字节|1970-01-01 00:00:01 UTC - 2038-01-19 03:14:07 UTC|存在2038问题|
|TIME|3字节|-838:59:59 - 838:59:59|可以表示24小时中的时刻，也可以表示时长|
|YEAR|1字节|0000, 1901-2155||

TIMESTAMP类型在存入数据库时会被自动转换为UTC时区。由于夏令时等本地时区转换规则的存在，这个转换不是一对一的。根据是否建立索引，按照TIMESTAMP列进行过滤的查询可能产生不同的结果。
  - https://dev.mysqld.com.cn/doc/refman/9.0/en/timestamp-lookups.html
  - https://www.cnblogs.com/fnlingnzb-learner/p/16008486.html

MySQL 5.6.4+支持为TIMESTAMP指定更高的精度：TIMESTAMP(3)表示精确到**毫秒**（大多数业务已经足够），TIMESTAMP(6)表示精确到微秒。该精度会增加存储空间占用，但不会扩大时间戳的范围，2038问题仍然存在。TIME(3)、TIME(6)同理。

`0000-00-00 00:00:00`称为**零日期（Zero Date）**，原本用于作为日期列的空值使用，且支持混合，如2009-00-00表示年份确定但是月份、日期均不确定的情况。不推荐使用零日期。自MySQL 5.7开始，严格模式自带对零日期的禁用。需要注意，`00:00:00`是真实存在的凌晨零点，不受限制，不应该与NULL混淆。

YEAR是一个专门用于存年份的类型，其优势是仅占据1字节空间（TINYINT级别）。早期存在YEAR(2)和YEAR(4)两个变体，但5.7中已经移除了YEAR(2)，目前的YEAR等价于早期的YEAR(4)。YEAR的插入规则较为特殊，最好确保插入的年份为4位数字，避免理解上的困难。

|插入值|结果|
|---|---|
|0、`'0'`、`'00'`|0000|
|1-69|2001-2069|
|**70-99**|**1970-1999**|
|1901-2055|1901-2055|
|其它|报错，非严格模式下转换为0000|


## JSON类型

JSON类型是5.7.8加入的一个实用类型。它在底层以二进制格式存储，写入时会校验有效性，支持部分更新。JSON列没有字符集、排序规则，且内部字符串固定使用utf8mb4编码；JSON列的最大大小受到max_allowed_packet的限制，范围为64MB（默认）-1GB。

JSON列的操作主要通过[`JSON_*`函数](https://dev.mysql.com/doc/refman/8.4/en/json-functions.html)进行，同时提供`->`和`->>`两个运算符作为语法糖。下面左右两类写法是等价的。

|函数写法|运算符写法|
|---|---|
|`JSON_EXTRACT(column, path)`|`column->path`|
|`JSON_UNQUOTE(JSON_EXTRACT(column, path))`|`column->>path`|

**JSON NULL和SQL NULL**：JSON NULL特指JSON内的空值，与SQL中自带的NULL不同。若JSON列没有设置NOT NULL，那么它可以是SQL NULL也可以是JSON NULL，前者可以通过`IS NULL`来判断，后者一般通过`JSON_TYPE(c) = 'NULL'`来判断，且需要注意当`c IS NULL`时，`JSON_TYPE(c) IS NULL`为真。

```sql
doc = {"a": null}
doc->>'$.a' -- 'null'
(doc->>'$.a') IS NULL -- 0
JSON_EXTRACT(doc,'$.a') IS NULL -- 0
JSON_TYPE(JSON_EXTRACT(doc,'$.a')) IS NULL -- 0
JSON_TYPE(JSON_EXTRACT(doc,'$.a')) = 'NULL' -- 1
JSON_EXTRACT(doc,'$.a') = 'null' -- 0 需要注意在这个位置，'null' 被视为是一个字符串
JSON_EXTRACT(doc,'$.a') = CAST('null' AS JSON) -- 1
```

尤其注意倒数两个案例，`'null'`这个表达式在不同的位置有着不同的含义。
- INSERT语句对应JSON列的VALUE位置，`'null'`就是JSON NULL，`'"null"'`才是字符串
- 与JSON值做比较时，`'null'`直接表示字符串。如果希望让`'null'`表示JSON NULL，需要明确`CAST(? AS JSON)`。
- 作为JSON函数的**值参数**时，`'null'`表示字符串；作为JSON函数的**文档参数**时，`'null'`表示JSON NULL。如
  - `JSON_TYPE('null') = 'NULL'`为真
  - `JSON_SET('{}','$.b','null')`实则在b的位置设置了一个内容为null的字符串

另外还有一些注意点：
- `JSON_SET(column, path, NULL)`这个表达式中的NULL是SQL NULL，但其效果与传入JSON NULL是相同的，会让path位置出现一个JSON NULL。

## 其它类型

下面这些类型一般用于专用领域存储：
- GEOMETRY
- POINT
- LINESTRING
- POLYGON
- ...