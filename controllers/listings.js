const Listing = require("../models/listing.js");


// index controller
module.exports.index = async (req, res)=>{
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});

};

//new listing route
module.exports.renderNewFrom = (req, res)=>{
    res.render("./listings/new.ejs");
};

module.exports.createListing = async (req, res)=>{
    let url = req.file.path;
    let filename = req.file.filename;

    let listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
};

// update listing
module.exports.renderUpdateForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("Error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    // console.log(listing);
    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("/upload","/upload/h_500,w_350");
    res.render("./listings/edit.ejs",{listing,originalUrl});
};

module.exports.updateListing = async (req, res)=>{
    let {id} = req.params;
    
    let listing =await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image ={url, filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
};


//delete listing
module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listing");
};

//show route
module.exports.showListing = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author",}}).populate("owner");
    if(!listing){
        req.flash("Error","Listing you requested for does not exist!");
        res.redirect("/listing");
    }
    res.render("./listings/show.ejs",{listing});
};