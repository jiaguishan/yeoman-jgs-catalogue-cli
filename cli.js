#!/usr/bin/env node
console.log('这里是cli工具')

// 脚手架的工作过程
// 1、通过命令行交互询问用户问题
// 2、根据用户回答的结果生成文件（目录）

// 命令行交互模块：inquirer
// 文件读写模块 ejs

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const ejs = require('ejs');

// inquirer 提供了一个 prompt 方法，用户向用户询问一些问题，并拿到用户回答的结果
inquirer.prompt([ // 第一个参数接受数组的参数，表示需要询问的问题集合
    {
        type: 'input', // 代表需要用户输入
        name: 'name', // 最终回答内容放入的变量，后续也可以通过这个变量在文件内拿到结果
        message: '创建的项目名称是？' // 给用户的提示内容
    }
]).then(answers => {
    // 拿到输入结果后进行生成文件
    // 首先拿到模板目录
    const tempDir = path.join(__dirname, 'templates');
    // 其次是拿到目标目录
    const targetDir = process.cwd();
    // 接着将模板目录下文件全部输出到目标目录
    fs.readdir(tempDir, (error, files) => {  // 首先去扫描tempDir下全部文件, 通过回调函数的files拿到全部的目录文件
        if (error) throw error; // 错误优先原则，且如果有错误则直接抛出错误并停止
        files.forEach(file => { // 没有错误时，通过files.forEach去遍历每个文件,结果是相对于tempDir的文件相对路径
            // 拿到路径后，通过模板引擎去渲染文件
            ejs.renderFile(path.join(tempDir, file), answers, (err, result) => {
                if (err) throw err;
                console.log(result);
                // 执行成功后通过文件的写入流将文件写入目标目录
                fs.writeFileSync(path.join(targetDir, file), result); // 写入时需要文件的绝对路径，因此也需要path拿,最后参数是内容，是这里的result
            }) // 第一个参数是文件的绝对略经，所以需要使用path工具拿到, 第二个参数是数据上下文，第三个是回调
        })
    })
});