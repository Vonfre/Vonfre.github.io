# Python 基础入门

Python 是一门简洁、易学且功能强大的编程语言，广泛应用于数据科学、Web 开发、自动化等领域。

## 为什么选择 Python？

- **简洁易读**：语法清晰，接近自然语言
- **功能强大**：丰富的标准库和第三方包
- **应用广泛**：从 Web 开发到机器学习都能胜任
- **社区活跃**：大量的学习资源和开源项目

## 基础语法

### 变量和数据类型

Python 中的变量不需要声明类型，直接赋值即可：

```python
# 整数
age = 25

# 浮点数
pi = 3.14159

# 字符串
name = "Python"

# 布尔值
is_active = True

# 列表
numbers = [1, 2, 3, 4, 5]

# 字典
person = {
    "name": "Alice",
    "age": 30,
    "city": "Beijing"
}
```

### 控制流

#### 条件语句

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"

print(f"成绩等级: {grade}")
```

#### 循环

```python
# for 循环
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# while 循环
count = 0
while count < 5:
    print(count)
    count += 1

# 列表推导式
squares = [x**2 for x in range(10)]
```

## 函数

函数是组织代码的基本单元：

```python
def greet(name, greeting="Hello"):
    """
    问候函数
    
    Args:
        name: 姓名
        greeting: 问候语，默认为 "Hello"
    
    Returns:
        完整的问候语
    """
    return f"{greeting}, {name}!"

# 调用函数
message = greet("Alice")
print(message)  # 输出: Hello, Alice!

message = greet("Bob", "Hi")
print(message)  # 输出: Hi, Bob!
```

## 面向对象编程

Python 支持面向对象编程：

```python
class Student:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        self.grades = []
    
    def add_grade(self, grade):
        self.grades.append(grade)
    
    def get_average(self):
        if not self.grades:
            return 0
        return sum(self.grades) / len(self.grades)
    
    def __str__(self):
        return f"Student(name={self.name}, age={self.age})"

# 创建对象
student = Student("Alice", 20)
student.add_grade(85)
student.add_grade(90)
student.add_grade(88)

print(student)
print(f"平均分: {student.get_average():.2f}")
```

## 常用内置函数

Python 提供了许多实用的内置函数：

```python
# len() - 获取长度
numbers = [1, 2, 3, 4, 5]
print(len(numbers))  # 5

# sum() - 求和
print(sum(numbers))  # 15

# max() 和 min() - 最大值和最小值
print(max(numbers))  # 5
print(min(numbers))  # 1

# sorted() - 排序
unsorted = [3, 1, 4, 1, 5, 9, 2, 6]
print(sorted(unsorted))  # [1, 1, 2, 3, 4, 5, 6, 9]

# enumerate() - 枚举
for index, value in enumerate(numbers):
    print(f"Index {index}: {value}")

# zip() - 并行迭代
names = ["Alice", "Bob", "Charlie"]
ages = [25, 30, 35]
for name, age in zip(names, ages):
    print(f"{name} is {age} years old")
```

## 文件操作

读写文件是常见的操作：

```python
# 写入文件
with open("example.txt", "w", encoding="utf-8") as f:
    f.write("Hello, Python!\n")
    f.write("这是第二行\n")

# 读取文件
with open("example.txt", "r", encoding="utf-8") as f:
    content = f.read()
    print(content)

# 逐行读取
with open("example.txt", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())
```

## 异常处理

使用 try-except 处理异常：

```python
def divide(a, b):
    try:
        result = a / b
        return result
    except ZeroDivisionError:
        print("错误：除数不能为零")
        return None
    except TypeError:
        print("错误：参数类型不正确")
        return None
    finally:
        print("计算完成")

# 测试
print(divide(10, 2))   # 5.0
print(divide(10, 0))   # 错误提示
```

## 常用标准库

Python 的标准库非常丰富：

```python
# datetime - 日期时间处理
from datetime import datetime, timedelta

now = datetime.now()
print(f"当前时间: {now}")

tomorrow = now + timedelta(days=1)
print(f"明天: {tomorrow}")

# random - 随机数
import random

print(random.randint(1, 100))  # 1-100 的随机整数
print(random.choice(['apple', 'banana', 'cherry']))  # 随机选择

# os - 操作系统接口
import os

print(os.getcwd())  # 当前工作目录
# os.makedirs("new_folder", exist_ok=True)  # 创建目录

# json - JSON 处理
import json

data = {"name": "Alice", "age": 25}
json_str = json.dumps(data, ensure_ascii=False)
print(json_str)

parsed_data = json.loads(json_str)
print(parsed_data["name"])
```

## 下一步学习

掌握了这些基础知识后，你可以继续学习：

1. **数据科学**：NumPy、Pandas、Matplotlib
2. **Web 开发**：Flask、Django、FastAPI
3. **机器学习**：Scikit-learn、TensorFlow、PyTorch
4. **自动化**：Selenium、Beautiful Soup

## 总结

Python 是一门优秀的入门语言，同时也能应对复杂的项目需求。通过不断练习和实践，你会越来越熟练地使用 Python 解决实际问题。

**记住**：编程最重要的是动手实践，多写代码才能真正掌握！
