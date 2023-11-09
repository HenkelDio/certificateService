const express = require('express')
const ejs = require('ejs')
const path = require('path')
const puppeteer = require('puppeteer')
const app = express()
const passengers = require('./mocks/passengers.js');

app.get('/pdf', async(request, response) => {

    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    await page.goto('http://localhost:8080/', {
        waitUntil: 'networkidle0'
    })

    const pdf = await page.pdf({
        path: path.join(__dirname, 'certificates', 'certificate.pdf'),
        printBackground: true,
        format: 'A4',
        landscape: true
    })

    await browser.close()


    response.contentType("application/pdf")

    return response.send(pdf)

})

app.get('/', (request, response) => {

    const filePath = path.join(__dirname, "template", "certificate.ejs")

    
    ejs.renderFile(filePath, { passengers }, (err, html) => {
        if(err) {
            return response.send('Erro na leitura do arquivo')
        }
    
        // enviar para o navegador
        return response.send(html)
    })
   
})

app.listen(8080, () => console.log("Server is running at port http://localhost:8080"))