const express = require('express');
const ejs = require('ejs');
const path = require('path');
const pdf = require('html-pdf');
const passengers = require('./mock/passengers');
const puppeteer = require('puppeteer');

const app = express();


app.get('/pdf', async (req, res) => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, "template", "index.ejs")

  const html = ejs.renderFile(filePath, { passengers }, (err, html) => {
    if(err) {
      return "<h1>error</h1>"
    }

    // enviar para o navegador
    return html;
})

  await page.setContent(html);
  const pdf = await page.pdf({
    landscape: true,
    printBackground: true,
    format: 'A4'
  })

  await browser.close();

  res.contentType("application/pdf");

  return res.send(pdf);

})

app.get('/', (req, res) => {
  const filePath = path.resolve(__dirname, "template", "index.ejs")
  ejs.renderFile(filePath, { passengers }, (err, html) => {
      if(err) {
        return res.json({"error": "Error on reading file"});
      }
  
      // enviar para o navegador
      return res.send(html)
  })
})

// app.get('/', (req, res) => {
  
//   const file = path.resolve(__dirname, "template", "index.ejs");

//   ejs.renderFile(file, { passengers }, (err, html) => {
//     if(err) {
//       return res.json({"error": "Error on reading file"});
//     }

//     const options = {
//       height: "11.25in",
//       width: "8.5in",
//       header: {
//           height: "20mm"
//       },
//       footer: {
//           height: "20mm"
//       }
//     }

//     pdf.create(html, options).toFile("certificado.pdf", (err, data) => {
//       if(err) {
//         return res.json({"error": "error on generating pdf"});
//       }

//       return res.send(html)

//     })

//   })

// })

app.listen(3000, () => console.log('Certificate service is running at http://localhost:3000'));