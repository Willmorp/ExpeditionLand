_satellite.pushAsyncScript(function(event, target, $variables){
  window.adobeExt = {};

// this function calls from code behind to get options
adobeExt.init = function (report_suiteId, option, serverVarPost, siteName) {
    adobeExt.options = $.extend({}, {
        searchType: '',
        one_day: (1000 * 60 * 60 * 24),
        serverVarPost: '',
        siteName: ''
    }, option);

    if (typeof serverVarPost == "string")
        adobeExt.options.serverVarPost = serverVarPost;

    if (typeof siteName == "string")
        adobeExt.options.siteName = siteName;

    adobeExt.reportSuiteId = report_suiteId;
};

// This will be called when contry changes from popover
adobeExt.setCountryCodeVar = function (e) {
    try {
        s.prop10 = e.args != null || e.args != undefined ? e.args : "US";
    } catch (err) {
        console.log(err);
    }
};

//This will be called when any one clicks on search panel
adobeExt.onSearchTabClick = function (e) {
    try {

        //var s = s_gi(s_account);
        if (e.args == "close") {
            if (typeof this.pageOrg == "object") {
                s.pageName = this.pageOrg.pageName;
                s.channel = this.pageOrg.channel;
                s.prop1 = this.pageOrg.prop1;
                s.prop2 = this.pageOrg.prop1;
                s.prop3 = this.pageOrg.prop1;
                void (s.t());
            }
            return;
        }
        if (typeof s.manageVars != "undefined") {
            var globVar = {
                prop9: s.prop9,
                eVar7: s.eVar7,
                prop10: s.prop10,
                server: s.server
            };
            s.manageVars("clearVars");
            s.prop9 = globVar.prop9;
            s.server = globVar.server;
            s.eVar7 = globVar.eVar7;
            s.prop10 = globVar.prop10;
        }
        if (this.pageOrg == undefined) {
            //This persist original page data
            this.pageOrg = {
                pageName: s.pageName,
                channel: s.channel,
                prop1: s.prop1,
                prop2: s.prop2,
                prop3: s.prop3
            };
        }
        s.pageName = adobeExt.options.siteName + ":search:" + e.args.toLowerCase().substring(0, 3) + " search";
        s.channel = "search";
        s.prop1 = "search:" + e.args.toLowerCase().substring(0, 3) + " search";
        s.prop2 = s.prop1;
        s.prop3 = s.prop1;
        void (s.t());
    }
    catch (err) {
        console.log(err);
    }
};


//This will be called when we search for product from search widget
adobeExt.trackSearch = function (productType, searchItem, totalItems, searchId) {
    var _self = this;

    //if (productType.toLowerCase() != _self.options.searchType)
    //    return;
    try {
        if (typeof s == "undefined") {
            return;
        }

        if (typeof s.account == "undefined") {
            setTimeout(function () {
                adobeExt.trackSearch(productType, searchItem, totalItems, searchId);
            }, 500);
            return;
        }

        //var s = s_gi(s_account);

        var initialize = function () {
            switch (productType.toLowerCase()) {
                case "flight":
                    s.prop15 = 'FLI';
                    switch (searchItem.loc.length) {
                        case 1:
                            _self._helper.setAirOWAdobeVar(searchItem, totalItems, searchId);
                            break;
                        default:
                            _self._helper.setAirMWAdobeVar(searchItem, totalItems, searchId);
                            break;
                    }
                    break;
                case "hotel":
                    s.prop15 = 'HOT';
                    _self._helper.setHotelAdobeVar(searchItem, totalItems);
                    break;
                case "car":
                    s.prop15 = 'CAR';
                    _self._helper.setCarAdobeVar(searchItem, totalItems);
                    break;
                case "activity":
                    s.prop15 = 'ACT';
                    _self._helper.setActivityAdobeVar(searchItem, totalItems);
                    break;
                case "hideaway":
                    s.prop15 = 'HID';
                    _self._helper.setHideawayAdobeVar(searchItem, totalItems);
                    break;
            }
            s.eVar35 = searchId;
        };
        initialize();
        void(s.t());
      
      console.log('search success')
      
    } catch (err) {
        console.log(err);
    }
};

// This will be called when any product view by user
adobeExt.onProductViewed = function (product) {
    try {
        //s = s_gi(s_account);
        s.linkTrackVars = "products,events,prop15,server,eVar37";
        s.linkTrackEvents = s.events = 'prodView';
        s.products = this._helper.getProductSku(product, false, false, true);

        s.server = window.location.host + adobeExt.options.serverVarPost;
        //void (s.t());
        s.tl(this, 'o', 'Product View');
    }
    catch (err) {
        console.log(err);
    }

};

// This will be called when any product is added in shopping cart
adobeExt.onCartProductAdded = function (product, cart) {
    try {
        //s = s_gi(s_account);
                console.log('fn started');
        s.linkTrackVars = "products,events,prop15,server";
        if (cart && cart.items.length > 1)
            s.linkTrackEvents = s.events = 'scAdd';
        else
            s.linkTrackEvents = s.events = 'scAdd,scOpen';

        s.products = this._helper.getProductSku(product, false, false);
                console.log(s.products);    
        
        //s.server = window.location.host + adobeExt.options.serverVarPost;
                console.log(s.server);
      
        s.tl(this, 'o', 'Product Added to Cart');
                console.log('s.tl call done');
    }
    catch (err) {
      console.log('bull shit');
        console.log(err);
    }

};

// This will be called when any product is added in shopping cart from mobile site
adobeExt.onCartProductAddedForMobile = function (product, bookNowBtn) {
    try {
        //s = s_gi(s_account);

        s.linkTrackVars = "products,events,prop15,server";
        s.linkTrackEvents = s.events = 'scAdd,scOpen';
        s.products = this._helper.getProductSku(product, false, false);

        s.server = window.location.host + adobeExt.options.serverVarPost;

        s.tl(bookNowBtn, 'o', 'Product Added to Cart');

    }
    catch (err) {
        console.log(err);
    }

};

//this will be called when any product removed from cart
adobeExt.onCartProductRemoved = function (product) {
    try {
       // var s = s_gi(s_account);
        s.linkTrackVars = 'products,events';
        s.linkTrackEvents = s.events = 'scRemove';
        s.products = this._helper.getCartSku(product);
        s.tl(this, 'o', 'Cart Removals');


    } catch (err) {
        console.log(err);
    }
};


//this will be called when any cart viewed
adobeExt.onCartProductViewed = function (products) {
    try {
       // var s = s_gi(s_account);
        s.linkTrackVars = 'products,events';
        s.linkTrackEvents = s.events = 'scView';
        s.products = this._helper.getCartSku(products);
        s.tl(this, 'o', 'Cart Views');

    } catch (err) {
        console.log(err);
    }

};

//This method fires passengerinfo init
adobeExt.onMobilePaxInfoInit = function (cart) {
    try {
        if (typeof s.account == "undefined") {
            setTimeout(function () {
                adobeExt.onMobilePageCheckout(cart);
            }, 500);
            return;
        }
        //var s = s_gi(s_account);
        s.pageName = adobeExt.options.siteName + ":checkout:passengerinfo";
        s.channel = "passengerinfo";
        s.prop1 = "checkout :passengerinfo";
        s.prop2 = "checkout :passengerinfo";
        s.events = "event7";
        if (!s.products) {
            s.products = this._helper.getProductSku(cart[0], false, false, false);
        }
        s.t();
    } catch (e) {
        console.log(e);
    }
};


//This method fires when checkout initialize
adobeExt.onCheckoutInitiated = function (cart, checkoutBtn) {
    try {
        //var s = s_gi(s_account);
        s.linkTrackVars = 'products,events';
        s.linkTrackEvents = s.events = 'scCheckout';
        s.products = this._helper.getCartSku(cart);
                s.tl(checkoutBtn, 'o', 'Checkout Initiated');
        console.log('chkout_success');
    } catch (err) {
        console.log(err);
    }
};

adobeExt.onMobilePageCheckout = function (cart) {
    try {
        if (typeof s.account == "undefined") {
            setTimeout(function () {
                adobeExt.onMobilePageCheckout(cart);
            }, 500);
            return;
        }
        //var s = s_gi(s_account);
        s.pageName = adobeExt.options.siteName + ":checkout:billing";
        s.channel = "checkout:billing";
        s.prop1 = "checkout:billing";
        s.prop2 = "checkout:billing";
        s.events = "event8";
        if (!s.products) {
            s.products = this._helper.getProductSku(cart[0], false, false, false);
        }
        s.t();
    } catch (e) {
        console.log(e);
    }
};

adobeExt.onPaymentPageCheckout = function (cart) {
    try {
        if (typeof s.account == "undefined") {
            setTimeout(function () {
                adobeExt.onPaymentPageCheckout(cart);
            }, 500);
            return;
        }
        //var s = s_gi(s_account);
        s.pageName = adobeExt.options.siteName + ":checkout:billing";
        s.channel = "checkout:billing";
        s.prop1 = "checkout:billing";
        s.prop2 = "checkout:billing";
        s.events = "event8";
        if (!s.products) {
            s.products = this._helper.getCartSku(cart, false, false, false);
        }
        s.t();
    } catch (e) {
        console.log(e);
    }
};

/// This method fire when cart purchase
adobeExt.trackBooking = function (cart) {
    try {
        var isBookedBySoftCash = false;
            if (typeof s == "undefined") {
            return;
        }

        if (typeof s.account == "undefined") {
            setTimeout(function () {
                adobeExt.trackBooking(cart);
            }, 500);
            return;
        }        
        //s = s_gi(s_account);
        s.linkTrackVars = "products,events,purchaseID,eVar7,eVar8,eVar9,eVar26,eVar27,eVar28,eVar29,eVar30,eVar33,state,zip,event9,prop9,prop10,event26";
        s.linkTrackEvents = s.events = 'purchase,event26,event9';
        if (cart.P && cart.P[0].BA) {
            if (cart.P[0].CM && cart.P[0].CM.N)
                s.eVar27 = cart.P[0].CM.N;
            else
                s.eVar27 = "";
            s.eVar29 = cart.P[0].BA.CN;
            s.zip = cart.P[0].BA.Z;
            s.eVar33 = "";
            s.events = 'purchase,event26,event9=0';
            if (cart.P[0].PT !== 0) {
                isBookedBySoftCash = true;
                s.state = cart.P[0].BA.S;
                s.eVar33 = 'RoviaBucks';
                s.events = 'purchase,event26,event9=' + cart.getTotalPrice(false);
            } else {
                s.state = cart.P[0].BA.SC;
            }
        }
        s.products = this._helper.getCartSku(cart, isBookedBySoftCash);
        s.purchaseID = cart.CN;
        if (s.products != "" && typeof s.products != "undefined") {
            s.tl(true, 'o', 'Product View');
        }
    } catch (err) {
        console.log(err);
    }
};

//This will be called when any form submit  successfully
adobeExt.formTracking = function (formName) {
    try {
        //var s = s_gi(s_account);
        s.linkTrackVars = 'eVar25,events';
        s.linkTrackEvents = 'event5';
        s.eVar25 = formName; // This will be the form name eg. "Cruise Request Form"
        s.events = 'event5';
        s.tl(true, 'o', 'Form Tracking');
    } catch (err) {
        console.log(err);
    }
};

//Thisa will be called when any one clicks on socail links
adobeExt.socialLinkTracking = function (linkName) {
    try {
        //var s = s_gi(s_account);
        s.linkTrackVars = 'eVar31,eVar32,events';
        s.linkTrackEvents = 'event10';
        s.eVar31 = s.pageName;
        s.eVar32 = linkName;
        s.events = 'event10';
        s.tl(true, 'o', 'Social Shares');
    } catch (err) {
        console.log(err);
    }
};

//This method used to track custom file download links
adobeExt.trackCustomFileDownloads = function (data) {
    try {
        //var s = s_gi(s_account);
        s.linkTrackVars = 'eVar10,events';
        s.linkTrackEvents = 'event3';
        s.eVar10 = data.innerHTML;
        s.events = 'event3';
        s.tl(true, 'd', 'File downloads');
    } catch (err) {
        console.log(err);
    }
};

//This method used when user clicks on contact us or email.
adobeExt.trackEmailSubscription = function () {
    try {
        //var s = s_gi(s_account);
        s.linkTrackVars = 'events';
        s.linkTrackEvents = 'event11';
        s.events = 'event11';
        s.tl(true, 'o', 'Contact Us');
    } catch (err) {
        console.log(err);
    }
};

//This method used when user clicks on live chat link
adobeExt.trackLiveChat = function () {
    try {
        //var s = s_gi(s_account);
        s.linkTrackVars = 'events';
        s.linkTrackEvents = 'event21';
        s.events = 'event21';
        s.tl(true, 'd', 'Chat Initiation');
    }
    catch (err) {
        console.log(err);
    }

};

// This is adobe helper object contains all helper methods
adobeExt._helper = {
    // Helper method for shopping cart

    getProductSku: function (product, isBookedBySoftCash, isBookedCart, isProdView) {

        switch (product.T.toLowerCase()) {
            case "hotel":
                return this.getHotelProductSku(product, isBookedBySoftCash, isBookedCart, isProdView);
                break;
            case "flight":
                return this.getFlightProductSku(product, isBookedBySoftCash, isBookedCart, isProdView);
                break;
            case "car":
                return this.getCarProductSku(product, isBookedBySoftCash, isBookedCart, isProdView);
                break;
            case "activity":
                return this.getActivityProductSku(product, isBookedBySoftCash, isBookedCart, isProdView);
                break;
        }
        return "";

    },

    getCartSku: function (cart, isBookedBySoftCash) {
        var sku = "";
        for (var cnt = 0; cnt < cart.items.length; cnt++) {
            if (cart.isBookedCart) {
                if (cart.items[cnt].PS && cart.items[cnt].PS.length > 0 && cart.items[cnt].PS[0].BS && (cart.items[cnt].PS[0].BS == 1 || cart.items[cnt].PS[0].BS == 2)) {
                    if (sku != "")
                        sku = sku + ",";
                    sku = sku + this.getProductSku(cart.items[cnt], isBookedBySoftCash, true);
                }
            } else {
                if (sku != "")
                    sku = sku + ",";
                sku = sku + this.getProductSku(cart.items[cnt], isBookedBySoftCash, false);
            }
        }
        return sku;
    },

    // To get sku item of each product
    getHotelProductSku: function (product, isBookedBySoftCash, isBookedCart, isProdView) {
        var str = "";
        if (isBookedCart) {
            str = str.concat(";HOT:", this.removeSpecialChars(product.N), ":", product.HId, ";1;", product.F.P.V);
            var segCount = this.getSegmentCounts(product);
            //var supplierName = segCount > 0 ? "amadeuswshotel" : product.HF;
            var supplierName = product.HF;
            if (this._isAmadeusHotel(product))
                supplierName = "amadeuswshotel";

            if (isBookedBySoftCash != undefined && isBookedBySoftCash)
                str = str + ";event9=" + product.F.P.V + "|event26=" + segCount + ";eVar30=" + supplierName + "|eVar33=RoviaBucks";
            else
                str = str + ";event9=0" + "|event26=" + segCount + ";eVar30=" + supplierName;
        } else if (isProdView) {
            var bookingSource = "NormalBooking";
            if (product.IRB) {
                bookingSource = "PreferredBooking";
            }
            str = str.concat(";HOT:", this.removeSpecialChars(product.N), ":", product.HId, ";;;;eVar37=", bookingSource);
        } else {
            str = str.concat(";HOT:", this.removeSpecialChars(product.N), ":", product.HId, ";;;;eVar30=", product.HF);
        }
        return str;
    },
    getFlightProductSku: function (product, isBookedBySoftCash, isBookedCart, isProdView) {
        var str = "";
        if (isBookedCart) {
            str = str.concat(";FLI:", product.FS.split('>').join('-').split('(')[0].trim(' '), " : ", product.AI.AL[0].FS[0].OA.SN, " : ", product.AI.AL[0].FS[0].FN, ";1;", product.AI.F.P.V);
            if (isBookedBySoftCash != undefined && isBookedBySoftCash)
                str = str + ";event9=" + product.AI.F.P.V + "|event26=" + this.getSegmentCounts(product) + ";eVar30=" + product.AI.AF.N + "|eVar33=RoviaBucks";
            else
                str = str + ";event9=0" + "|event26=" + this.getSegmentCounts(product) + ";eVar30=" + product.AI.AF.N;
        } else if (isProdView) {
            str = str.concat(";FLI:", product.FS, ";;;;");
        } else {
            str = str.concat(";FLI:", product.FS.split('>').join('-').split('(')[0].trim(' '), " : ", product.AI.AL[0].FS[0].OA.SN, " : ", product.AI.AL[0].FS[0].FN, ";;;;eVar30=", product.AI.AF.N);
        }
        return str;
    },
    getCarProductSku: function (product, isBookedBySoftCash, isBookedCart, isProdView) {
        var str = "";

        if (isBookedCart) {
            str = str.concat(";CAR:", this.removeSpecialChars(product.C), ":", this.removeSpecialChars(product.V.CC), ":", this.removeSpecialChars(product.V.N), ";1;", product.F.P.V);

            if (isBookedBySoftCash != undefined && isBookedBySoftCash)
                str = str + ";event9=" + product.F.P.V + "|event26=" + this.getSegmentCounts(product) + ";eVar30=" + product.CFS + "|eVar33=RoviaBucks";
            else
                str = str + ";event9=0" + "|event26=" + this.getSegmentCounts(product) + ";eVar30=" + product.CFS;
        } else if (isProdView) {
            str = str.concat(";CAR:", this.removeSpecialChars(product.C), ":", this.removeSpecialChars(product.V.CC), ":", this.removeSpecialChars(product.V.N));
        } else {
            str = str.concat(";CAR:", this.removeSpecialChars(product.C), ":", this.removeSpecialChars(product.V.CC), ":", this.removeSpecialChars(product.V.N), ";;;;eVar30=", product.CFS);
        }
        return str;
    },
    getActivityProductSku: function (product, isBookedBySoftCash, isBookedCart, isProdView) {

        var str = "";

        if (isBookedCart) {
            str = str.concat(";ACT:", this.removeSpecialChars(product.AI.NM), ";1;", product.AI.SO.PF[0].P.V);

            if (isBookedBySoftCash != undefined && isBookedBySoftCash)
                str = str + ";event9=" + product.AI.SO.PF[0].P.V + ";eVar30=" + product.AI.AFS.N + "|eVar33=RoviaBucks";
            else
                str = str + ";event9=0;eVar30=" + product.AI.AFS.N;
        } else if (isProdView) {
            str = str.concat(";ACT:", this.removeSpecialChars(product.AI.NM), ";;;;");
        } else {
            str = str.concat(";ACT:", this.removeSpecialChars(product.AI.NM), ";;;;eVar30=", product.AI.AFS.N);
        }
        return str;
    },

    // To get segment counts
    getSegmentCounts: function (product) {
        var count = 0;
        if (product != null) {
            switch (product.T.toLowerCase()) {
                case 'flight':
                    if (product.AI != null && product.AI.AL != null && product.AI.AL.length > 0) {
                        for (var counter = 0; counter < product.AI.AL.length; counter++) {
                            count = count + product.AI.AL[counter].FS.length;
                        }
                    }
                    break;
                case 'hotel':
                    //if (product != null && product.HF.toLowerCase().indexOf('amadeusws') > -1)
                    if (this._isAmadeusHotel(product))
                        count = 1;
                    break;
                case 'car':
                    count = 1;
                    break;
            }
        }
        return count;
    },

    _isAmadeusHotel: function (product) {
        return product != null && product.HF.toLowerCase().indexOf('amadeusws') > -1;
    },
    //Helper method search
    //Get cabin class from number
    getCabinClassString: function (cabinCode) {
        switch (cabinCode) {
            case 0:
                return "Economy";
            case 1:
                return "First";
            case 2:
                return "Business";
            case 3:
                return "Premium Economy";
            case 4:
                return "No Preferences";
            default:
                return "No Preferences";
        }
    },

    removeSpecialChars: function (str) {
        return str.replace(/[^\w-\s]/g, "");
    },

    //setting adobe variables as per product
    setAdobeVar: function (type, obj) {
        s.prop16 = type.substring(0, 3).toUpperCase() + ":" + obj.prop16; //Place of origin
        s.prop17 = type == "Flight" || type == "Car" ? type.substring(0, 3).toUpperCase() + ":" + obj.prop17 : obj.prop17; // Place of destination
        s.prop18 = type.substring(0, 3).toUpperCase() + ":" + obj.prop18; // Place of origin - Place of destination 
        s.prop19 = obj.prop19; //Total passenger count
        s.prop20 = obj.prop20; //LOS/ Stay duration
        s.prop21 = obj.prop21; // Start date
        s.prop22 = obj.prop22; //In Case Of Flights End Date is Return Date
        s.prop23 = Math.abs(this.getTotalNumberOfDays(new Date(obj.prop21), new Date())); // Booking Window
        s.prop24 = obj.prop24; //Cabin class
        s.prop25 = obj.prop25;
    },

    //this function calls when flight search happens
    setAirOWAdobeVar: function (searchItem, totalItems) {
        this.setAdobeVar("Flight",
            {
                prop16: searchItem.loc[0].sc,
                prop17: searchItem.loc[0].dc,
                prop18: searchItem.loc[0].sc + "-" + searchItem.loc[0].dc,
                prop19: searchItem.TotalPax,
                prop20: '',
                prop21: searchItem.loc[0].di,
                prop22: searchItem.loc[0].rdi,
                prop23: searchItem.loc[0].di,
                prop24: this.getCabinClassString(searchItem.CabinClass),
                prop25: totalItems
            });
    },
    setAirMWAdobeVar: function (searchItem, totalItems) {
        this.setAdobeVar("Flight",
            {
                prop16: searchItem.loc[0].sc,
                prop17: searchItem.loc[searchItem.loc.length - 1].sc,
                prop18: searchItem.loc[0].sc + "-" + searchItem.loc[searchItem.loc.length - 1].sc,
                prop19: searchItem.TotalPax,
                prop20: '',
                prop21: searchItem.loc[0].di,
                prop22: searchItem.loc[searchItem.loc.length - 1].di,
                prop23: '',
                prop24: this.getCabinClassString(searchItem.CabinClass),
                prop25: totalItems
            });
    },

    //this function calls when hotel search happens
    setHotelAdobeVar: function (searchItem, totalItems) {
        this.setAdobeVar("Hotel",
            {
                prop16: searchItem.loc,
                prop17: '',
                prop18: searchItem.loc,
                prop19: searchItem.paxCnt,
                prop20: this.getTotalNumberOfDays(new Date(searchItem.cout), new Date(searchItem.cin)),
                prop21: searchItem.cin,
                prop22: searchItem.cout,
                prop23: '',
                prop24: '',
                prop25: totalItems
            });
    },

    //this function calls when car search happens
    setCarAdobeVar: function (searchItem, totalItems) {
        this.setAdobeVar("Car",
            {
                prop16: searchItem.pickUpLoc,
                prop17: searchItem.dropOffLoc,
                prop18: searchItem.pickUpLoc + "-" + searchItem.dropOffLoc,
                prop19: '',
                prop20: '',
                prop21: searchItem.pickUp,
                prop22: searchItem.dropOff,
                prop23: '',
                prop24: '',
                prop25: totalItems
            });
    },

    //this function calls when activity search happens
    setActivityAdobeVar: function (searchItem, totalItems) {
        this.setAdobeVar("Activity",
            {
                prop16: searchItem.dest,
                prop17: '',
                prop18: searchItem.dest,
                prop19: '',
                prop20: this.getTotalNumberOfDays(new Date(searchItem.toDate), new Date(searchItem.fromDate)),
                prop21: searchItem.fromDate,
                prop22: searchItem.toDate,
                prop23: '',
                prop24: '',
                prop25: totalItems
            });
    },

    //this function calls when hideaway search happens
    setHideawayAdobeVar: function (searchItem, totalItems) {
        this.setAdobeVar("Hideaway",
            {
                prop16: searchItem.loc,
                prop17: '',
                prop18: searchItem.loc,
                prop19: '',
                prop20: '',
                prop21: searchItem.duration,
                prop22: '',
                prop23: '',
                prop24: '',
                prop25: totalItems
            });
    },

    //This method return total number of days between two dates
    getTotalNumberOfDays: function (date1, date2) {
        if (adobeExt.options !== undefined)
            return Math.round((date1 - date2) / adobeExt.options.one_day);

    }
};


});
