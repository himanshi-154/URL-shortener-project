const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

mongoose.connect('mongodb://localhost/urlShortener' , {
    
})
app.set('view engine' , 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res)=> {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.listen(process.env.PORT || 5000);