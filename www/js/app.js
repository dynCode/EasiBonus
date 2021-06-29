var module = angular.module('app', ['onsen', 'ngMap', 'ngSanitize', 'ngFileUpload','720kb.socialshare','angular.filter']);

// angular data filters
module.filter('externalLinks', function() {
    return function(text) {
        //return String(text).replace(/href=/gm, "class=\"ex-link\" href=");
        //return String(text).replace(/href=/gm, "ng-click=\"exLink()\" href=");
        //
        // NOTE:
        // can't use ng-click as it is not in Angular Land as $sce and ng-bind-html
        // ALSO - must do filters in this order 'content | externalLinks | to_trusted'
        //        so this string stays in content
        return String(text).replace(/href=/gm, "onclick=\"angular.element(this).scope().exLink(this);return false\" href=");
    };
});

module.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);

module.controller('AppController', function($scope, $http, $window, $timeout, $filter, Upload, NgMap) {
    $scope.apiPath = 'https://agribonus.co.za/easiBonus/api/';
    //$scope.apiPath = 'https://agribonus.co.za/easiDev/api/';
    $scope.data = [];
    
    // quick search partner list
    $scope.searchPartnerList = [];

    //Membder Data
    $scope.userMpacc = '';
    $scope.userPass = ''; 
    $scope.loggedIn = false;
    $scope.guest = true;
    $scope.updateDate = '';
    $scope.totalEarned = '';
    $scope.totalBonusEarned = '';
    $scope.totalUsed = '';
    $scope.currentUnits = '';
    $scope.currentRands = '';
    $scope.sessionId = '';
    $scope.FirstName = '';
    $scope.LastName = '';
    $scope.gender = '';
    $scope.title = '';
    $scope.IdNumber = '';
    $scope.dob = '';
    $scope.EmailAddress = '';
    $scope.ContactNumber = '';
    $scope.DailCode = '';
    $scope.Country = '';
    $scope.Province = '';
    $scope.City = '';
    $scope.Suburb = '';
    $scope.Addressline1 = '';
    $scope.Addressline2 = '';
    $scope.Addressline3 = '';
    $scope.postalCode = '';
    $scope.Title = '';
    $scope.tierDes = '';
    $scope.CardNumber = '';
    $scope.comId = '';
    $scope.commun = '';
    $scope.tokenBalance = '';
    $scope.totalDiscount = '';
    $scope.virtualCard = '';
    $scope.pgMpacc = '';
    $scope.memType = '';
    $scope.totalFramers = '';
    $scope.enrolDate = '';
    $scope.adrressInfo = [];
    $scope.CountryDetails = '';
    
    //tranaction fields
    $scope.transList = "";
    $scope.discountList = "";
    $scope.shellCardNum = "";

    // set member reg field to false
    $scope.cardReg = false;

    // topbar and footer colours
    $scope.topbarBG = '#fff';
    $scope.footerBG = '';

    // Farmers
    $scope.farmers = [];
    $scope.farmerInfo = [];
    $scope.framerTransList = [];

    $scope.geopos = {lat: -12.7811725, lng: 30.140058};
    $scope.tDate = toString(new Date().toISOString().split('T')[0]);

    $scope.init = function() {
        // get page content scope data
        var user = $window.localStorage.getItem('user'); 
        var pass = $window.localStorage.getItem('pass'); 
        var tandc = $window.localStorage.getItem('tandc');
        var ftime = $window.localStorage.getItem('ftime');

        $window.localStorage.setItem('ftime','yes');

        if (user && pass) {
            //modal.show();
            $scope.data.errorCode = 'Checking if you are logged in...';
            $http.post($scope.apiPath+'login.php', {"reqType" : "login", "user" : user, "pass" : pass})
            .success(function(data, status){
                if (data['error'] == 0) {
                    console.log("Data:", data);
                    //modal.hide();
                    $scope.totalEarned = data['totalEarned'];
                    $scope.totalBonusEarned = data['totalBonusEarned'];
                    $scope.totalUsed = data['totalUsed'];
                    $scope.totalBucks = data['totalBucks'];
                    $scope.currentUnits = data['currentUnits'];
                    $scope.currentRands = data['currentRands'];
                    $scope.userMpacc = data['memNum'];
                    $scope.userPass = pass;
                    $scope.sessionId = data['sessionId'];
                    $scope.loggedIn = true;
                    $scope.guest = false;
                    $scope.FirstName = data['FirstName'];
                    $scope.LastName = data['LastName'];
                    $scope.gender = data['gender'];
                    $scope.IdNumber = data['IdNumber'];
                    $scope.dob = data['dob'];
                    $scope.EmailAddress = data['EmailAddress'];
                    $scope.ContactNumber = data['ContactNumber'];
                    $scope.DailCode = data['dailCode'];
                    $scope.Country = data['Country'];
                    $scope.Province = data['Province'];
                    $scope.City = data['City'];
                    $scope.Suburb = data['Suburb'];
                    $scope.District = data['District'];
                    $scope.Addressline1 = data['Addressline1'];
                    $scope.Addressline2 = data['Addressline2'];
                    $scope.Addressline3 = data['Addressline3'];
                    $scope.postalCode = data['postalCode'];
                    $scope.Title = data['title'];
                    $scope.tierDes = data['tierDes'];
                    $scope.CardNumber = '62786401'+user;
                    $scope.comId = data['comId'];
                    $scope.commun = data['commun'];
                    $scope.tokenBalance = data['tokenBalance'];
                    $scope.totalDiscount = data['totalDiscount'];
                    $scope.virtualCard = data['virtualCard'];
                    $scope.memType = data['memberType'];
                    $scope.totalFramers = data['totalFramers'];
                    $scope.enrolDate = data['enrolDate'];
                    $scope.adrressInfo.CityCode = data['CityCode'];
                    $scope.adrressInfo.CountryCode = data['CountryCode'];
                    $scope.adrressInfo.DistrictCode = data['DistrictCode'];
                    $scope.adrressInfo.ProvinceCode = data['ProvinceCode'];
                    $scope.adrressInfo.SuburbCode = data['SuburbCode'];
                    $scope.adrressInfo.CountryList = data['listCountries'];
                    $scope.adrressInfo.ProvinceList = data['listProvince'];
                    $scope.adrressInfo.disList = data['listDistrict'];
                    $scope.adrressInfo.CityList = data['listCity'];
                    $scope.adrressInfo.PlacesList = data['listPlace'];
                    $scope.CountryDetails = data['CountryDetails'];
                    myNavigator.pushPage('views/home.html', { animation : 'fade' });
                } else {
                    ons.notification.alert({
                        message: 'Auto login failed, please log in manually.',
                        title: 'Hmmmmm?',
                        buttonLabel: 'Continue',
                        animation: 'default',
                        callback: function() {
                            $scope.data = [];
                            myNavigator.pushPage('views/login.html', { animation : 'fade' });
                        }
                    });
                }
            })
            .error(function(data, status) {
                myNavigator.pushPage('views/login.html', { animation : 'fade' });
            });
        } else {
            myNavigator.pushPage('views/login.html', { animation : 'fade' });
        }
    };

    // login checker
    $scope.LogIn = function() {
        var user = $scope.data.loyaltyNum;
        var pass = $scope.data.password;
        var remember = $scope.data.remeber;
        
        console.log("Form Data:", $scope.data);

        if (user && pass) {
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post($scope.apiPath+'login.php', {"reqType" : "login", "user" : user, "pass" : pass})
            .success(function(data, status){
                if (data['error'] == 0) {
                    console.log("Data:", data);
                    modal.hide();
                    $scope.totalEarned = data['totalEarned'];
                    $scope.totalBonusEarned = data['totalBonusEarned'];
                    $scope.totalUsed = data['totalUsed'];
                    $scope.totalBucks = data['totalBucks'];
                    $scope.currentUnits = data['currentUnits'];
                    $scope.currentRands = data['currentRands'];
                    $scope.userMpacc = data['memNum'];
                    $scope.userPass = pass;
                    $scope.sessionId = data['sessionId'];
                    $scope.loggedIn = true;
                    $scope.guest = false;
                    $scope.FirstName = data['FirstName'];
                    $scope.LastName = data['LastName'];
                    $scope.gender = data['gender'];
                    $scope.IdNumber = data['IdNumber'];
                    $scope.dob = data['dob'];
                    $scope.EmailAddress = data['EmailAddress'];
                    $scope.ContactNumber = data['ContactNumber'];
                    $scope.DailCode = data['dialCode'];
                    $scope.Country = data['Country'];
                    $scope.Province = data['Province'];
                    $scope.City = data['City'];
                    $scope.Suburb = data['Suburb'];
                    $scope.District = data['District'];
                    $scope.Addressline1 = data['Addressline1'];
                    $scope.Addressline2 = data['Addressline2'];
                    $scope.Addressline3 = data['Addressline3'];
                    $scope.postalCode = data['postalCode'];
                    $scope.Title = data['title'];
                    $scope.tierDes = data['tierDes'];
                    $scope.CardNumber = '62786401'+user;
                    $scope.comId = data['comId'];
                    $scope.commun = data['commun'];
                    $scope.tokenBalance = data['tokenBalance'];
                    $scope.totalDiscount = data['totalDiscount'];
                    $scope.virtualCard = data['virtualCard'];
                    $scope.memType = data['memberType'];
                    $scope.totalFramers = data['totalFramers'];
                    $scope.enrolDate = data['enrolDate'];
                    $scope.adrressInfo.CityCode = data['CityCode'];
                    $scope.adrressInfo.CountryCode = data['CountryCode'];
                    $scope.adrressInfo.DistrictCode = data['DistrictCode'];
                    $scope.adrressInfo.ProvinceCode = data['ProvinceCode'];
                    $scope.adrressInfo.SuburbCode = data['SuburbCode'];
                    $scope.adrressInfo.CountryList = data['listCountries'];
                    $scope.adrressInfo.ProvinceList = data['listProvince'];
                    $scope.adrressInfo.disList = data['listDistrict'];
                    $scope.adrressInfo.CityList = data['listCity'];
                    $scope.adrressInfo.PlacesList = data['listPlace'];
                    $scope.CountryDetails = data['CountryDetails'];
                    modal.show();
                    $scope.data.errorCode = 'Collecting your data...';

                    if (remember) {
                        $window.localStorage.setItem('user',user); 
                        $window.localStorage.setItem('pass',pass);
                    }
                    
                    if (data['changePass'] !== 'N') {
                        modal.hide();
                        $scope.data = [];
                        myNavigator.pushPage('views/user/updatepassword.html', { animation : 'fade' });
                    } else {
                        if (user === pass) {
                            modal.hide();
                            ons.notification.confirm({
                                message: 'Your password is unsecure, click OK to change your password or cancel to continue',
                                callback: function(idx) {
                                    switch (idx) {
                                        case 0:
                                            $scope.data = [];
                                            myNavigator.pushPage('views/home.html', { animation : 'fade' });
                                            break;
                                        case 1:
                                            $scope.data = [];
                                            myNavigator.pushPage('views/user/updatepassword.html', { animation : 'fade' });
                                            break;
                                    }
                                }
                            });
                        } else {
                            $timeout(function(){
                                modal.hide();
                                $scope.data = [];
                                myNavigator.pushPage('views/home.html', { animation : 'fade' });
                            },'2000');
                        }
                    }
                } else {
                    modal.hide();
                    $scope.data.errorCode = data['html'];
                    ons.notification.alert({
                        message: data['html'],
                        title: 'Oops!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            })
            .error(function(data, status) {
                modal.hide();
                ons.notification.alert({
                    message: 'Request failed. Try Again!',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            });
        } else {
            $scope.data.errorCode = 'Invalid Loyalty Number or Password.';
            ons.notification.alert({
                message: 'Invalid Loyalty Number or Password!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };
    
    // password reset
    $scope.restPass = function () {
        var MPAcc = $scope.data.reset_MPacc;

        if (MPAcc) {
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post($scope.apiPath+'restpass.php', {"reqType" : "restPass", "MPAcc" : MPAcc})
            .success(function(data, status){
                if (data['error'] == 0) {
                    modal.hide();
                    ons.notification.alert({
                        message: data['html'],
                        title: 'Yay!',
                        buttonLabel: 'Continue',
                        animation: 'default',
                        callback: function() {
                            $scope.data = [];
                            myNavigator.pushPage('views/updatepassword.html', { animation : 'fade' });
                        }
                    });
                } else {
                    modal.hide();
                    ons.notification.alert({
                        message: data['html'],
                        title: 'Error',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            })
            .error(function(data, status) {
                modal.hide();
                ons.notification.alert({
                    message: 'Request failed. Try Again!',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            });
        } else {
            ons.notification.alert({
                message: 'Please fill in your membership number.',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };

    //password update
    $scope.updatePass = function () {
        var MPAcc = $scope.data.pu_MPacc;
        var oldPass = $scope.data.pu_oldPass;
        var password = $scope.data.pu_newPass;
        var re_pass = $scope.data.pu_newPassR;

        if (MPAcc, oldPass, password, re_pass) {
            if (password.length >= 5) {
                if (password === re_pass) {
                    var pattern = new RegExp(
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
                    );

                    // Print Yes If the string matches
                    // with the Regex
                    if (pattern.test(password)) {
                        modal.show();
                        $scope.data.errorCode = 'Processing, please wait...';
                        $http.post($scope.apiPath+'updatepass.php', {"member" : MPAcc, "password" : password, "oldpassword" : oldPass })
                        .success(function(data, status){
                            if (data['error'] == 0) {
                                modal.hide();
                                ons.notification.alert({
                                    message: data['html'],
                                    title: 'Yay!',
                                    buttonLabel: 'Continue',
                                    animation: 'default',
                                    callback: function() {
                                        $scope.data = [];
                                        myNavigator.resetToPage('views/login.html', { animation : 'fade' });
                                    }
                                });
                            } else {
                                modal.hide();
                                ons.notification.alert({
                                    message: data['html'],
                                    title: 'Error',
                                    buttonLabel: 'OK',
                                    animation: 'default'
                                });
                            }
                        })
                        .error(function(data, status) {
                            modal.hide();
                            ons.notification.alert({
                                message: 'Request failed. Try Again!',
                                title: 'Oops!',
                                buttonLabel: 'OK',
                                animation: 'default'
                            });
                        });
                    } else {
                        ons.notification.alert({
                            message: 'Your new passwords did not conform to the set rules.',
                            title: 'Oops!',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }
                    
                } else {
                    ons.notification.alert({
                        message: 'Your new passwords did not match.',
                        title: 'Oops!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            } else {
                ons.notification.alert({
                    message: 'Password not long enough.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        } else {
            ons.notification.alert({
                message: 'Please fill all the fields.',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };

    $scope.updateCurPass = function () {
        var MPAcc = $scope.userMpacc;
        var oldPass = $scope.userPass;
        var password = $scope.data.pu_newPass;
        var re_pass = $scope.data.pu_newPassR;

        console.log('MPAcc',MPAcc);
        console.log('oldPass',oldPass);
        console.log('password',password);
        console.log('re_pass',re_pass);

        if (MPAcc, oldPass, password, re_pass) {
            if (password.length >= 5) {
                if (password === re_pass) {
                    var pattern = new RegExp(
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"
                    );

                    // Print Yes If the string matches
                    // with the Regex
                    if (pattern.test(password)) {
                        modal.show();
                        $scope.data.errorCode = 'Processing, please wait...';
                        $http.post($scope.apiPath+'updatepass.php', {"member" : MPAcc, "password" : password, "oldpassword" : oldPass })
                        .success(function(data, status){
                            if (data['error'] == 0) {
                                $window.localStorage.setItem('pass',password);
                                $scope.userPass = password;
                                modal.hide();
                                ons.notification.alert({
                                    message: data['html'],
                                    title: 'Yay!',
                                    buttonLabel: 'Continue',
                                    animation: 'default',
                                    callback: function() {
                                        $scope.data = [];
                                        myNavigator.resetToPage('views/home.html', { animation : 'fade' });
                                    }
                                });
                            } else {
                                modal.hide();
                                ons.notification.alert({
                                    message: data['html'],
                                    title: 'Error',
                                    buttonLabel: 'OK',
                                    animation: 'default'
                                });
                            }
                        })
                        .error(function(data, status) {
                            modal.hide();
                            ons.notification.alert({
                                message: 'Request failed. Try Again!',
                                title: 'Oops!',
                                buttonLabel: 'OK',
                                animation: 'default'
                            });
                        });
                    } else {
                        ons.notification.alert({
                            message: 'Your new passwords did not conform to the set rules.',
                            title: 'Oops!',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }
                } else {
                    modal.hide();
                    ons.notification.alert({
                        message: 'Your new passwords did not match.',
                        title: 'Oops!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            } else {
                modal.hide();
                ons.notification.alert({
                    message: 'Password not long enough.',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }
        } else {
            modal.hide();
            ons.notification.alert({
                message: 'Please fill all the fields.',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };


    // setup update fields
    $scope.SetupUpdate = function() {
        $scope.data.up_name = $scope.FirstName;
        $scope.data.up_surname = $scope.LastName;
        $scope.data.up_dialcode = $scope.DailCode;
        $scope.data.up_cell = $scope.ContactNumber;
        $scope.data.up_mail = $scope.EmailAddress;
        $scope.data.up_id = $scope.IdNumber;
        $scope.data.up_count = $scope.adrressInfo.CountryCode;
        $scope.data.up_prov = $scope.adrressInfo.ProvinceCode;
        $scope.data.up_dist = $scope.adrressInfo.DistrictCode;
        $scope.data.up_ciry = $scope.adrressInfo.CityCode;
        $scope.data.up_place = $scope.adrressInfo.SuburbCode;
        $scope.data.up_coords = $scope.Addressline1;
        
        if ($scope.data.up_coords !== '') {
            var corsd = $scope.Addressline1.split(',');
            $scope.geopos.lat = corsd[0], 
            $scope.geopos.lng = corsd[1];
        }

        myNavigator.pushPage('views/user/profile_update.html', { animation : 'fade' });
    };

    //update profile
    $scope.updateProfile = function () {
        var LastName = $scope.data.up_surname;
        var FirstName = $scope.data.up_name;
        var MobileNumber = $scope.data.up_cell;
        var EmailAddress = $scope.data.up_mail;
        var IDNumber = $scope.data.up_id;
        var Country = $scope.data.up_count.code;
        var Province = $scope.data.up_prov.value;
        var District = $scope.data.up_dist.value;
        var City = $scope.data.up_ciry.value;
        var Place = $scope.data.up_place.value;
        var GPS = $scope.data.up_coords;
        var dailCode = $scope.data.up_dialcode;
        
        if (MobileNumber && EmailAddress) {
            modal.show();
            $scope.data.errorCode = 'Processing, please wait...';
            $http.post($scope.apiPath+'updateProfile.php', {"reqType" : "update", "LastName" : LastName, "FirstName" : FirstName, "MobileNumber" : MobileNumber, "EmailAddress" : EmailAddress, "IDNumber" : IDNumber, "Country" : Country, "Province" : Province, "District" : District, "City" : City, "Place" : Place, "GPS" : GPS, "Agent" : $scope.userMpacc, "dailCode" : dailCode, "sessionId" : $scope.sessionId})
            .success(function(data, status){
                console.log("Data:", data);
                if (data['error'] == 0) {
                    console.log("Data:", data);
                    modal.hide();

                    ons.notification.alert({
                        message: data['html'],
                        title: 'Yay!',
                        buttonLabel: 'Continue',
                        animation: 'default',
                        callback: function() {
                            $scope.data = [];
                            //myNavigator.resetToPage('views/home.html', { animation : 'fade' });

                            var user = $scope.userMpacc;
                            var pass = $scope.userPass; 

                            if (user && pass) {
                                modal.show();
                                $scope.data.errorCode = 'Please wait, we are quickly loading your new details...';
                                $http.post($scope.apiPath+'login.php', {"reqType" : "login", "user" : user, "pass" : pass})
                                .success(function(data, status){
                                    if (data['error'] == 0) {
                                        console.log("Data:", data);
                                        modal.hide();
                                        $scope.totalEarned = data['totalEarned'];
                                        $scope.totalBonusEarned = data['totalBonusEarned'];
                                        $scope.totalUsed = data['totalUsed'];
                                        $scope.totalBucks = data['totalBucks'];
                                        $scope.currentUnits = data['currentUnits'];
                                        $scope.currentRands = data['currentRands'];
                                        $scope.sessionId = data['sessionId'];
                                        $scope.loggedIn = true;
                                        $scope.guest = false;
                                        $scope.FirstName = data['FirstName'];
                                        $scope.LastName = data['LastName'];
                                        $scope.gender = data['gender'];
                                        $scope.IdNumber = data['IdNumber'];
                                        $scope.dob = data['dob'];
                                        $scope.EmailAddress = data['EmailAddress'];
                                        $scope.ContactNumber = data['ContactNumber'];
                                        $scope.DailCode = data['dialCode'];
                                        $scope.Country = data['Country'];
                                        $scope.Province = data['Province'];
                                        $scope.City = data['City'];
                                        $scope.Suburb = data['Suburb'];
                                        $scope.District = data['District'];
                                        $scope.Addressline1 = data['Addressline1'];
                                        $scope.Addressline2 = data['Addressline2'];
                                        $scope.Addressline3 = data['Addressline3'];
                                        $scope.postalCode = data['postalCode'];
                                        $scope.Title = data['title'];
                                        $scope.tierDes = data['tierDes'];
                                        $scope.CardNumber = '62786401'+user;
                                        $scope.comId = data['comId'];
                                        $scope.commun = data['commun'];
                                        $scope.tokenBalance = data['tokenBalance'];
                                        $scope.totalDiscount = data['totalDiscount'];
                                        $scope.virtualCard = data['virtualCard'];
                                        $scope.memType = data['memberType'];
                                        $scope.totalFramers = data['totalFramers'];
                                        $scope.enrolDate = data['enrolDate'];
                                        $scope.adrressInfo.CityCode = data['CityCode'];
                                        $scope.adrressInfo.CountryCode = data['CountryCode'];
                                        $scope.adrressInfo.DistrictCode = data['DistrictCode'];
                                        $scope.adrressInfo.ProvinceCode = data['ProvinceCode'];
                                        $scope.adrressInfo.SuburbCode = data['SuburbCode'];
                                        $scope.adrressInfo.CountryList = data['listCountries'];
                                        $scope.adrressInfo.ProvinceList = data['listProvince'];
                                        $scope.adrressInfo.disList = data['listDistrict'];
                                        $scope.adrressInfo.CityList = data['listCity'];
                                        $scope.adrressInfo.PlacesList = data['listPlace'];
                                        $scope.CountryDetails = data['CountryDetails'];
                                        modal.show();
                                        $scope.data.errorCode = 'Collecting your data...';

                                        $timeout(function(){
                                            modal.hide();
                                            $scope.data = [];
                                            myNavigator.pushPage('views/home.html', { animation : 'fade' });
                                        },'2000');
                                    } else {
                                        modal.hide();
                                        $scope.data.errorCode = data['html'];
                                        ons.notification.alert({
                                            message: data['html'],
                                            title: 'Oops!',
                                            buttonLabel: 'OK',
                                            animation: 'default'
                                        });
                                    }
                                });
                            }
                        }
                    });

                } else {
                    modal.hide();
                    ons.notification.alert({
                        message: data['html'],
                        title: 'Error',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }
            })
            .error(function(data, status) {
                modal.hide();
                ons.notification.alert({
                    message: 'Request failed. Try Again!',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            });  
        } else {
            ons.notification.alert({
                message: 'Please complete all required fields',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };

    // last 10 transactions
    $scope.myTransactions = function () {
        var user = $scope.userMpacc;
        var pass = $scope.userPass; 

        console.log("user: " + user+", pass: "+pass+", sessionId: " +$scope.sessionId);

        $scope.transList = [];
        modal.show();
        $scope.data.errorCode = 'Processing, please wait...';
        $http.post($scope.apiPath+'translistList.php', {"user" : user, "pass" : pass, "sessionId" : $scope.sessionId})
        .success(function(data, status){
            console.log("Data:",data);
            modal.hide();
            $scope.transList = data['tranactions'];
            $scope.discountList = data['discounts'];
            if (data) {
                myNavigator.pushPage('views/user/mytransactions.html', { animation : 'fade'});
            } else {
                ons.notification.alert({
                    message: 'No transactions found.',
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };

    // log out function
    $scope.logout = function(){
        $scope.data = [];
        $scope.loggedIn = false;
        $scope.guest = true;
        $window.localStorage.removeItem('user'); 
        $window.localStorage.removeItem('pass'); 
        myNavigator.resetToPage('views/login.html', { animation : 'fade' });
    };
    
    // show my farmers list
    $scope.myFarmers = function() {
        var user = $scope.userMpacc;
        $scope.data = [];
        modal.show();
        $scope.data.errorCode = 'Processing, please wait...';
        $http.post($scope.apiPath+'farmers.php', {"reqType" : "myFarmers", "user" : user})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                $scope.farmers = data['farmers']['data'];
                console.log("farmers:",$scope.farmers);
                myNavigator.pushPage('views/user/my_farmers.html', { animation : 'fade'});
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    // show selected farmer
    $scope.viewFarmer = function(fid) {
        var selFarmer = fid;
        var user = $scope.userMpacc;
        $scope.data = [];
        $scope.farmerInfo = [];
        $scope.framerTransList = [];
        $scope.data.dop = $filter("date")(Date.now(), 'yyyy-MM-dd', 'UTC+2');
        modal.show();
        $scope.data.errorCode = 'Processing, please wait...';
        $http.post($scope.apiPath+'farmers.php', {"reqType" : "viewFarmer", "farmer" : selFarmer, "user" : user})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                $scope.farmerInfo = data['farmer'];
                console.log("Farmer Data:",$scope.farmerInfo);
                
                $scope.data.CountryList = $scope.farmerInfo.listCountries.data;
                $scope.data.ProvinceList = $scope.farmerInfo.listProvince.data;
                $scope.data.disList = $scope.farmerInfo.listDistrict.data;
                $scope.data.CityList = $scope.farmerInfo.listCity.data;
                $scope.data.PlacesList = $scope.farmerInfo.listPlace.data;
                
                let other = {value: "other", label: "Other"};
                $scope.data.PlacesList.push(other);
                
                if ($scope.farmerInfo.SuburbCode.value === 'other') {
                    $scope.data.otherplace = $scope.farmerInfo.SuburbCode.label;
                }
                
                $http.post($scope.apiPath+'farmers.php', {"reqType" : "viewFarmerTrans", "farmer" : selFarmer, "user" : user})
                .success(function(data){
                    modal.hide();
                    if (data['error'] == '0') {
                        $scope.framerTransList = data['transactions'];
                        console.log("Farmer Tranactions:",$scope.framerTransList);
                    } else {
                        ons.notification.alert({
                            message: data['html'],
                            title: 'Sorry!',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }         
                })
                .error(function(data, status) {
                    modal.hide();
                    ons.notification.alert({
                        message: 'Request failed. Try Again!',
                        title: 'Oops!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                });
                
                myNavigator.pushPage('views/user/farmer_details.html', { animation : 'fade'});
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    // set country dd
    $scope.startRegisterFarmer = function() {
        $scope.data = [];
        console.log("Country Data:", $scope.CountryDetails);
        
        modal.show();
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getProv", "for" : $scope.CountryDetails.data.code})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.CountryList = $scope.CountryDetails;
                $scope.data.dialcode = $scope.CountryDetails.data.dialcode;
                $scope.data.fcount = $scope.CountryDetails.data;
                $scope.data.ProvinceList = data.ProvinceList.data;
                $scope.data.fsendsms = true;
                $scope.data.fsendemail = true;
                myNavigator.pushPage('views/user/register_farmer.html', { animation : 'slide' } );
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
        /*
        modal.show();
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getCountry"})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.CountryList = data.CountryList.data;
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
         * 
         */
    };
    
    // set provinces
    $scope.setProvinces = function(selCountry) {
        modal.show();
        var country = selCountry.code;
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getProv", "for" : country})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.ProvinceList = data.ProvinceList.data;
                $scope.data.dialcode = selCountry.dialcode;
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    // set ditricts
    $scope.setDistricts = function() {
        modal.show();
        var prov = $scope.data.fprov.value;
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getDis", "for" : prov})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.disList = data.disList.data;
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    // set ditricts
    $scope.setCities = function() {
        modal.show();
        var prov = $scope.data.fprov.value;
        var dist = $scope.data.fdist.value;
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getCities", "forP" : prov, "forD" : dist})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.CityList = data.CityList.data;
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    // set places dd list
    $scope.setPlaces = function () {
        modal.show();
        var prov = $scope.data.fprov.value;
        var dist = $scope.data.fdist.value;
        var city = $scope.data.fciry.value;
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getPlaces", "forP" : prov, "forD" : dist, "forC" : city})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.PlacesList = data.PlacesList.data;
                let other = {value: "other", label: "Other"};
                $scope.data.PlacesList.push(other);
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    $scope.toFarmerConfirm = function() {
        
        console.log("$scope.data.fcount:", $scope.data.fcount);
        
        var country = $scope.data.fcount || '';
        var prov = $scope.data.fprov || '';
        var dist = $scope.data.fdist || '';
        var city = $scope.data.fciry || ''; 
        var place = $scope.data.fplace || '';
        var mobile = $scope.data.fcell || ''; 
        var Surname = $scope.data.fsurname || '';
        var fdob = $scope.data.fdob || '';
        var fgender = $scope.data.fgender || '';
        var errorMsg = '';
        var canCon = false;
        
        var regExp = /^0[0-9].*$/;
        
        if (Surname === '') {
            errorMsg = 'Please fill in surname';
        } else if (mobile === '') {
            errorMsg = 'Please fill in mobile number';
        } else if (country === '') {
            errorMsg = 'Please select Country';
        } else if (prov === '') {
            errorMsg = 'Please select Province';
        } else if (dist === '') {
            errorMsg = 'Please select District';
        } else if (city === '') {
            errorMsg = 'Please select City/Town/Sector';
        } else if (place === '') {
            errorMsg = 'Please select Place/Village';
        } else if (fdob === '') {
            errorMsg = 'Please select date of birth';
        } else if (fgender === '') {
            errorMsg = 'Please select gender';
        } else if (!regExp.test(mobile)) {
            errorMsg = 'Mobile number must start with a 0';    
        } else if (mobile.length != 10) {
            errorMsg = 'Mobile number must be 10 digits long'; 
        } else {
            canCon = true;
        }
        
        console.log("status:", canCon);
        
        if (canCon) {
            myNavigator.pushPage('views/user/register_farmer_conf.html', { animation : 'fade'});
        } else {
            ons.notification.alert({
                message: errorMsg,
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };
    
    // register farmer
    $scope.registerFarmer = function() {
        $scope.data.regBusy = true;
        modal.show();
        $scope.data.errorCode = 'Processing, please wait...';
        var LastName = $scope.data.fsurname;
        var FirstName = $scope.data.fname;
        var MobileNumber = $scope.data.fcell;
        var EmailAddress = $scope.data.fmail;
        var IDNumber = $scope.data.fid;
        var Country = $scope.data.fcount.code;
        var Province = $scope.data.fprov.value;
        var District = $scope.data.fdist.value;
        var City = $scope.data.fciry.value;
        if ($scope.data.fplace.value === 'other') {
            var Place = $scope.data.otherplace;
        } else {
            var Place = $scope.data.fplace.value;
        }
        var GPS = $scope.data.fcoords;
        var dailCode = $scope.data.dialcode;
        var dob = $scope.data.fdob;
        var gender = $scope.data.fgender;
        var sendemail = $scope.data.fsendemail;
        var sendsms = $scope.data.fsendsms;
        var fieldValue = $scope.data.ffieldValue;
        
        $scope.data.errorCode = 'Processing, please wait...';
        $http.post($scope.apiPath+'farmers.php', {"reqType" : "regFarmer", "LastName" : LastName, "FirstName" : FirstName, "MobileNumber" : MobileNumber, "EmailAddress" : EmailAddress, "IDNumber" : IDNumber, "Country" : Country, "Province" : Province, "District" : District, "City" : City, "Place" : Place, "GPS" : GPS, "Agent" : $scope.userMpacc, "dailCode" : dailCode, "dob" : dob, "gender" : gender, "sendemail" : sendemail, "sendsms" : sendsms, "fieldValue" : fieldValue})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                ons.notification.alert({
                    message: data['html'],
                    title: 'Done',
                    buttonLabel: 'Continue',
                    animation: 'default',
                    callback: function() {
                        $scope.data = [];
                        $scope.totalFramers = parseInt($scope.totalFramers)+1;
                        $scope.viewFarmer(data.farmerMpacc);
                    }
                });
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
        
    };
    
    // Edit farmer details
    $scope.editFarmer = function(memnum) {
        var memnum = memnum;
        
        $scope.data.fname = $scope.farmerInfo.FirstName;
        $scope.data.fsurname = $scope.farmerInfo.LastName;
        $scope.data.dialcode = $scope.farmerInfo.countryCode;
        $scope.data.fcell = $scope.farmerInfo.ContactNumber;
        $scope.data.fmail = $scope.farmerInfo.EmailAddress;
        $scope.data.fid = $scope.farmerInfo.IdNumber;
        $scope.data.fcount = $scope.farmerInfo.CountryCode;
        $scope.data.fprov = $scope.farmerInfo.ProvinceCode;
        $scope.data.fdist = $scope.farmerInfo.DistrictCode;
        $scope.data.fciry = $scope.farmerInfo.CityCode;
        $scope.data.fplace = $scope.farmerInfo.SuburbCode;
        $scope.data.fcoords = $scope.farmerInfo.Addressline1;
        $scope.data.fgender = $scope.farmerInfo.gender;
        $scope.data.fdob = new Date($scope.farmerInfo.dob);
        $scope.data.ffieldValue = parseFloat($scope.farmerInfo.fieldValue);
        $scope.data.fsendemail = $scope.farmerInfo.sendemail;
        $scope.data.fsendsms = $scope.farmerInfo.sendsms;
        
        if ($scope.data.fcoords !== '') {
            var corsd = $scope.farmerInfo.Addressline1.split(',');
            $scope.geopos.lat = corsd[0], 
            $scope.geopos.lng = corsd[1];
        }
        $scope.data.fmpacc = memnum;
        myNavigator.pushPage('views/user/farmer_edit.html', { animation : 'fade'});
    };
    
    // update farmer info
    $scope.updateFarmer = function() {
        $scope.data.regBusy = true;
        modal.show();
        $scope.data.errorCode = 'Processing, please wait...';
        var LastName = $scope.data.fsurname;
        var FirstName = $scope.data.fname;
        var MobileNumber = $scope.data.fcell;
        var EmailAddress = $scope.data.fmail;
        var IDNumber = $scope.data.fid;
        var Country = $scope.data.fcount.code;
        var Province = $scope.data.fprov.value;
        var District = $scope.data.fdist.value;
        var City = $scope.data.fciry.value;
        if ($scope.data.fplace.value === 'other') {
            var Place = $scope.data.otherplace;
        } else {
            var Place = $scope.data.fplace.value;
        }
        var GPS = $scope.data.fcoords;
        var fmpacc = $scope.data.fmpacc;
        var dailCode = $scope.data.dialcode;
        var dob = $scope.data.fdob;
        var gender = $scope.data.fgender;
        var fieldValue = $scope.data.ffieldValue;
        var sendemail = $scope.data.fsendemail;
        var sendsms = $scope.data.fsendsms;
        
        $scope.data.errorCode = 'Processing, please wait...';
        $http.post($scope.apiPath+'editFarmer.php', {"reqType" : "updateFarmer", "LastName" : LastName, "FirstName" : FirstName, "MobileNumber" : MobileNumber, "EmailAddress" : EmailAddress, "IDNumber" : IDNumber, "Country" : Country, "Province" : Province, "District" : District, "City" : City, "Place" : Place, "GPS" : GPS, "Agent" : $scope.userMpacc, "fmpacc" : fmpacc, "dailCode" : dailCode, "dob" : dob, "gender" : gender, "fieldValue" : fieldValue, "sendemail" : sendemail, "sendsms" : sendsms})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                ons.notification.alert({
                    message: data['html'],
                    title: 'Done',
                    buttonLabel: 'Continue',
                    animation: 'default',
                    callback: function() {
                        $scope.data = [];
                        $scope.viewFarmer(fmpacc);
                    }
                });
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    // build product product categories for transaction
    $scope.buildProdCats = function() {
        
        modal.show();
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getProdCats", "memnum" : $scope.userMpacc})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.dop = $filter("date")(Date.now(), 'yyyy-MM-dd', 'UTC+2');
                console.log("Set Date:", $scope.data.dop);
                $scope.data.ProdCats = data.pcats.data;
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    $scope.setProducts = function() {
        var pcat = $scope.data.pcat.value;
        modal.show();
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "getProducts", "pcat" : pcat, "memnum" : $scope.userMpacc})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                $scope.data.Prods = data.products.data;
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    $scope.productLookup = function() {
        var barcode = $scope.data.barcode;
        
        if (!barcode) {
            barcode = document.getElementById("barcodeScanned").value;
        }
        
        console.log("barcode Data:", barcode);
        
        modal.show();
        $scope.data.errorCode = 'Building list...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "lookupProduct", "barcode" : barcode, "memnum" : $scope.userMpacc})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                console.log("Cat Val:", data.products.data[0].productClassCode);
                $scope.data.pcat = data.pacat.data[0];
                $scope.data.Prods = data.products.data;
                $scope.data.prod = data.products.data[0];
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    $scope.checkTransFields = function(type) {
        var barcode = $scope.data.barcode;
        var pcat = $scope.data.pcat;
        var prod = $scope.data.prod;
        var dop = $scope.data.dop;
        var dnn = $scope.data.dnn;
        var qty = $scope.data.qty;
        var tval = $scope.data.tval;
        var errorMsg = '';
        var canCon = false;
        
        console.log("Trans DATA:",$scope.data);
        
        if (!barcode) {
            errorMsg = 'Please fill a barcode';
        } else if (!pcat) {
            errorMsg = 'Please select a category';
        } else if (!prod) {
            errorMsg = 'Please select a product';
        } else if (!dop) {
            errorMsg = 'Please select a date of transaction';
        } else if (!dnn) {
            errorMsg = 'Please enter delivery note';
        } else if (!qty) {
            errorMsg = 'Please enter a quantity';
        } else if (typeof tval === 'undefined') {
            errorMsg = 'Please enter a value';
        } else {
            canCon = true;
        }
        
        console.log("status:", canCon);
        
        if (canCon) {
            myNavigator.pushPage('views/user/new_trans_conf.html', { animation : 'lift' } );
        } else {
            ons.notification.alert({
                message: errorMsg,
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };
    
    // filter date
    $scope.$watch('data.dop', function (newDate) {
        $scope.data.dop = $filter('date')(newDate, 'yyyy-MM-dd', 'UTC+2'); 
    });
    $scope.newFarmTrans = function (memnum) {
        var barcode = $scope.data.barcode;
        var pcat = $scope.data.pcat.value;
        var prod = $scope.data.prod.productName;
        var pId = $scope.data.prod.partnerId;
        var dop = $scope.data.dop;
        var dnn = $scope.data.dnn;
        var qty = $scope.data.qty;
        var tval = $scope.data.tval;
        var fmpacc = memnum;
        
        $scope.data.errorCode = 'Processing, please wait...';
        $http.post($scope.apiPath+'transactions.php', {"reqType" : "newTrans", "barcode" : barcode, "pcat" : pcat, "prod" : prod, "dop" : dop, "dnn" : dnn, "qty" : qty, "tval" : tval, "pId" : pId, "amemnum" : $scope.userMpacc, "fmpacc" : fmpacc})
        .success(function(data){
            modal.hide();
            if (data['code'] == '200') {
                console.log("Return Data:", data);
                ons.notification.alert({
                    message: 'Transaction processed, thank you.',
                    title: 'Done',
                    buttonLabel: 'Continue',
                    animation: 'default',
                    callback: function() {
                        $scope.data = [];
                        $scope.viewFarmer(fmpacc);
                    }
                });
            } else {
                ons.notification.alert({
                    message: data['message'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    // load old transaction
    $scope.editTrans = function(transId) {
        console.log("transID", transId);
        
        let selTrans = $scope.framerTransList[transId];
        
        console.log("selTrans", selTrans);
        
        
        // get product details
        modal.show();
        $scope.data.errorCode = 'Building transaction...';
        $http.post($scope.apiPath+'build_dd.php', {"reqType" : "lookupProductName", "prodname" : selTrans.label, "memnum" : $scope.userMpacc})
        .success(function(data){
            modal.hide();
            if (data['error'] == '0') {
                console.log("Return Data:", data);
                console.log("Cat Val:", data.products.data[0].productClassCode);
                $scope.data.barcode = data.products.data[0].productCode;
                $scope.data.dop = selTrans['transactionDate'];
                $scope.data.dnn = selTrans['invoiceNumber'];
                $scope.data.pcat = data.pacat.data[0];
                $scope.data.Prods = data.products.data;
                $scope.data.prod = data.products.data[0];
                $scope.data.rev = selTrans['reverse'];
                $scope.data.transID = transId;
                $scope.data.tval = selTrans['ActValue'];
                $scope.data.qty = selTrans['quantity'];
                myNavigator.pushPage('views/user/view_farmer_trans.html', { animation : 'fade'});
            } else {
                ons.notification.alert({
                    message: data['html'],
                    title: 'Sorry!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            }         
        })  
        .error(function(data, status) {
            modal.hide();
            ons.notification.alert({
                message: 'Request failed. Try Again!',
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        });
    };
    
    $scope.reversOrder = function() {
        var transId = $scope.data.transID;
        let selTrans = $scope.framerTransList[transId];
        var invoiceNumber = selTrans['invoiceNumber'];
        var invoiceDate = selTrans['invDate'];
        var pid = $scope.data.prod.partnerId;
        var fmpacc = $scope.farmerInfo.memNum;
        var actValue = selTrans['ActValue'];
        
        ons.notification.confirm({
            message: 'Are you sure you would like to continue?',
            title: 'You are about to reverse a transaction.',
            callback: function(idx) {
                $http.post($scope.apiPath+'transactions.php', {"reqType" : "reverseOrder", "invoiceNumber" : invoiceNumber, "amemnum" : $scope.userMpacc, "fmpacc" : fmpacc, "pid" : pid, "actValue" : actValue, "invoiceDate" : invoiceDate})
                .success(function(data){
                    modal.hide();
                    if (data['code'] == '200') {
                        console.log("Return Data:", data);
                        ons.notification.alert({
                            message: 'Transaction refunded, thank you.',
                            title: 'Done',
                            buttonLabel: 'Continue',
                            animation: 'default',
                            callback: function() {
                                $scope.data = [];
                                $scope.viewFarmer(fmpacc);
                            }
                        });
                    } else {
                        ons.notification.alert({
                            message: data['message'],
                            title: 'Sorry!',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }       
                })
                .error(function(data, status) {
                    modal.hide();
                    ons.notification.alert({
                        message: 'Request failed. Try Again!',
                        title: 'Oops!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                });
            }
        });
    };
    
    // build bulk transaction
    $scope.buildBulkTrans = function() {
        var barcode = $scope.data.barcode;
        var pcat = $scope.data.pcat;
        var prod = $scope.data.prod;
        var dop = $scope.data.dop;
        var dnn = $scope.data.dnn;
        var qty = $scope.data.qty;
        var tval = $scope.data.tval;
        var errorMsg = '';
        var canCon = false;
        
        console.log("Trans DATA:",$scope.data);
        
        if (!barcode) {
            errorMsg = 'Please fill a barcode';
        } else if (!pcat) {
            errorMsg = 'Please select a category';
        } else if (!prod) {
            errorMsg = 'Please select a product';
        } else if (!dop) {
            errorMsg = 'Please select a date of transaction';
        } else if (!dnn) {
            errorMsg = 'Please enter delivery note';
        } else if (!qty) {
            errorMsg = 'Please enter a quantity';
        } else if (typeof tval === 'undefined') {
            errorMsg = 'Please enter a value';
        } else {
            canCon = true;
        }
        
        console.log("status:", canCon);
        
        if (canCon) {
            var user = $scope.userMpacc;
            modal.show();
            $scope.data.errorCode = 'Getting farmers, please wait...';
            $http.post($scope.apiPath+'farmers.php', {"reqType" : "myFarmers", "user" : user})
            .success(function(data){
                modal.hide();
                if (data['error'] == '0') {
                    $scope.farmers = data['farmers']['data'];
                    console.log("farmers:",$scope.farmers);
                    myNavigator.pushPage('views/user/bulk_trans_farmers.html', { animation : 'fade'});
                } else {
                    ons.notification.alert({
                        message: data['html'],
                        title: 'Sorry!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                }         
            })
            .error(function(data, status) {
                modal.hide();
                ons.notification.alert({
                    message: 'Request failed. Try Again!',
                    title: 'Oops!',
                    buttonLabel: 'OK',
                    animation: 'default'
                });
            });
        } else {
            ons.notification.alert({
                message: errorMsg,
                title: 'Oops!',
                buttonLabel: 'OK',
                animation: 'default'
            });
        }
    };
    
    $scope.processBulkTrans = function() {
        console.log("Data to process:", $scope.data);
        
        var barcode = $scope.data.barcode;
        var pcat = $scope.data.pcat.value;
        var prod = $scope.data.prod.productName;
        var pId = $scope.data.prod.partnerId;
        var dop = $scope.data.dop;
        var dnn = $scope.data.dnn;
        var qty = $scope.data.qty;
        var tval = $scope.data.tval;
        var fmpacc = $scope.data.farmer_id;
        ons.notification.confirm({
            message: 'You are about to do a bulk transaction which will load a transaction on serveral farmer accounts.',
            title: 'Are you sure you would like to continue?',
            buttonLabels : ["NO", "Yes"],
            callback: function(idx) {
                $scope.data.errorCode = 'Processing, please wait...';
                $http.post($scope.apiPath+'transactions.php', {"reqType" : "bulkTrans", "barcode" : barcode, "pcat" : pcat, "prod" : prod, "dop" : dop, "dnn" : dnn, "qty" : qty, "tval" : tval, "pId" : pId, "amemnum" : $scope.userMpacc, "fmpacc" : fmpacc})
                .success(function(data){
                    modal.hide();
                    if (data['code'] == '200') {
                        console.log("Return Data:", data);
                        ons.notification.alert({
                            message: data['message'],
                            title: 'Done',
                            buttonLabel: 'Continue',
                            animation: 'default',
                            callback: function() {
                                $scope.data = [];
                                myNavigator.pushPage('views/home.html', { animation : 'fade'});
                            }
                        });
                    } else {
                        ons.notification.alert({
                            message: data['message'],
                            title: 'Sorry!',
                            buttonLabel: 'OK',
                            animation: 'default'
                        });
                    }         
                })
                .error(function(data, status) {
                    modal.hide();
                    ons.notification.alert({
                        message: 'Request failed. Try Again!',
                        title: 'Oops!',
                        buttonLabel: 'OK',
                        animation: 'default'
                    });
                });
            }
        });
    };
    
    $scope.showActionMenu = function () {
        if ($scope.loggedIn) {
            ons.openActionSheet({
                title: '',
                cancelable: true,
                buttons: [
                    {
                        label: '<i><img src="images/AgentProfileIcoWhite.svg"></i><span class="p-r-20">Home</span>'
                    },
                    {
                        label: 'My Profile'
                    },
                    {
                        label: 'About Us'
                    },
                    {
                        label: 'Help'
                    },
                    {
                        label: 'Contact Us'
                    },
                    {
                        label: 'Log-out'
                    },
                    {
                        label: 'Privacy Policy'
                    }
                ]
            }).then(function (index) { 
                switch (index) {
                    case 0:
                        myNavigator.resetToPage('views/home.html', { animation : 'fade' });
                        break;
                    case 1:
                        myNavigator.pushPage('views/user/my_profile.html', { animation : 'fade' });
                        break;
                    case 2:
                        myNavigator.pushPage('views/aboutus.html', { animation : 'slide' });
                        break;
                    case 3:
                        myNavigator.pushPage('views/support.html', { animation : 'slide' });
                        break;
                    case 4:
                        myNavigator.pushPage('views/contactUs.html', { animation : 'fade' });
                        break;
                    case 5:
                        $scope.logout();
                        break;
                    case 6:
                        myNavigator.pushPage('views/privacy.html', { animation : 'fade' });
                        break;
                }
            });
        } else {
            ons.openActionSheet({
                title: '',
                cancelable: true,
                buttons: [
                    {
                        label: 'Login'
                    },
                    {
                        label: 'Close'
                    }
                ]
            }).then(function (index) { 
                switch (index) {
                    case 0:
                        myNavigator.pushPage('views/login.html', { animation : 'fade' });
                        break;
                }
            });
        }
    };
}); 

// Map Controler

module.controller('mapController', function ($scope, $timeout, NgMap) {
    $scope.render = true;
    $scope.validation_text = "";

    $scope.$on('mapInitialized', function(evt, evtMap) {
        
        var myLatlng = new google.maps.LatLng(parseFloat($scope.geopos.lat),parseFloat($scope.geopos.lng));
        
        $scope.map = evtMap;
        $scope.marker = new google.maps.Marker({position: evt.latLng, map: $scope.map});
        $scope.marker.setPosition(myLatlng);
        $scope.click = function(evt) {
            var latitude = evt.latLng.lat().toPrecision(8);
            var longitude = evt.latLng.lng().toPrecision(8);
            $scope.validation_text = "";
            $scope.marker.setPosition(evt.latLng);
            $scope.map.panTo(evt.latLng);
            $scope.map.setZoom(10);
            $scope.geopos.lat = latitude;
            $scope.geopos.lng = longitude;     
            $scope.validation_text = "lat: "+latitude+", lng: "+longitude;
        };
    });

});

// normal JS
// check if obejct is empty 
function isNotEmpty(myObject) {
    for(var key in myObject) {
        if (myObject.hasOwnProperty(key)) {
            return true;
        }
    }
    return false;
}

// direction = boolean value: true or false. If true, go to NEXT slide; otherwise go to PREV slide

// Barcode scanner
function scanBarcodeRegShop(){
    cordova.plugins.barcodeScanner.scan(
      function (result) {
          document.getElementById('cashierCode').value = result.text;
          console.log("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
}

function showHideScanner() {
    var x = document.getElementById("interactive");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function showDivAttid(con,divid){
    if(con === 'show') {
        document.getElementById(divid).style.display = 'block';
    } else {
        document.getElementById(divid).style.display = 'none';
    }
}