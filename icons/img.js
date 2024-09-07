console.log('图标转换');

// 引入 sharp 库
const sharp = require('sharp');
const path = require('path');

// 获取当前工作目录并拼接输入图片的文件路径
const inputPath = path.join(process.cwd(), 'icons', 'icon.png');
console.log('Input Path:', inputPath);

// 定义输出图片路径
const output64Path = path.join(process.cwd(), 'views', 'img', 'ic_logo.64.png');
const output256Path = path.join(process.cwd(), 'views', 'img', 'ic_logo.256.png');
const TemplatePath = path.join(process.cwd(), 'views', 'img', 'ic_logo.Template.png');
const Template2Path = path.join(process.cwd(), 'views', 'img', 'ic_logo.Template@2x.png');
const outputPath = path.join(process.cwd(), 'views', 'img', 'ic_launcher.png');
// 函数：调整图片大小
const resizeImage = async (input, width, height, output) => {
  try {
    await sharp(input)
      .resize(width, height)
      .toFile(output);
    console.log(`成功将图片调整为 ${width}x${height} 并保存为 ${output}`);
  } catch (error) {
    console.error(`调整图片为 ${width}x${height} 时出错:`, error);
  }
};
// / 将图像调整为 250x250 并居中放置在透明背景的 800x600 画布上
sharp(inputPath)
  .resize(250, 250)  // 调整 logo 尺寸为 250x250
  .extend({
    top: 120,    // 上下扩展的尺寸，确保图片垂直居中 (600 - 250) / 2
    bottom: 175,
    left: 275,   // 左右扩展的尺寸，确保图片水平居中 (800 - 250) / 2
    right: 275,
    background: { r: 0, g: 0, b: 0, alpha: 0 }  // 透明背景
  })
  .png()  // 输出为 PNG 格式以支持透明背景
  .toFile(outputPath, (err, info) => {
    if (err) {
      console.error('处理图片时出错:', err);
    } else {
      console.log('图片已成功处理并保存:', info);
    }
  });


// 执行图片调整
resizeImage(inputPath, 64, 64, output64Path);
resizeImage(inputPath, 256, 256, output256Path);
resizeImage(inputPath, 32, 32, Template2Path);
