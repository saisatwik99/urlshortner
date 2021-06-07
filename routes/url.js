const express = require('express');
const Router = express.Router();
const validUrl = require("valid-url");
const shortid = require("shortid");
const config = require("config");

const Url = require("../models/Url");

//@route    POST /api/url/shorten
//@desc     Create short URL
Router.post('/shorten', async (req, res) => {
    const { longUrl } = req.body;
    const baseUrl = config.get('baseUrl');
    console.log(baseUrl);
    if(!validUrl.isUri(baseUrl)){
        return res.status(401).json('Invalid base URL');
    }

    //Create URL code
    const urlCode = shortid.generate();

    //Check long URL 
    if(validUrl.isUri(longUrl)) {
        try{
            let url = await Url.findOne({longUrl});

            if(url){
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;

                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                });

                await url.save();

                return res.json(url);
            }

        } catch(err){
            console.log(err);
            res.status(500).json('Server Error');
        }
    } else {
        res.status(401).json('Invalid long URL');
    }

})



module.exports = Router;