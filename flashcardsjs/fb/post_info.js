window.fbAsyncInit = function () {
    FB.init({
        appId: '495058567539872',
        xfbml: true,
        version: 'v2.10'
    });
    FB.AppEvents.logPageView();
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
    } else {
        // The person is not logged into your app or we are unable to tell.
        document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function placeResultToId(data, id) {
    document.getElementById(id).innerText = data;
}

function getInfo() {
    let url = document.getElementById("post_url").value;
    let regex = /https:\/\/www\.facebook\.com\/groups\/(.*?)\/permalink\/(.*?)\//i;
    let regexres = url.match(regex);
    const id = regexres[2];
    const groupId = regexres[1];
    placeResultToId(groupId, 'post_grp');
    FB.api(
        '/' + id,
        function (response) {
            if (response && !response.error) {
                console.log(response);
                placeResultToId(response.created_time, 'post_date');
                placeResultToId(response.message, 'post_txt');
                const fullId = response.id;
                FB.api(
                    '/' + fullId + '/attachments',
                    (response) => {
                        console.info(response);
                        console.log(response.data["0"].media.image.src);
                        placeResultToId(response.data["0"].media.image.src, 'post_pic')
                    }
                );
                FB.api(
                    '/' + fullId + '/likes',
                    (response) => {
                        console.info(response);
                        placeResultToId(response.data.length, 'post_likes');
                    }
                );
                FB.api(
                    '/' + fullId + '/comments',
                    (response) => {
                        console.info(response);
                        placeResultToId(response.data.length, 'post_comments');
                    }
                );
            }
            else {
                console.error(response);
            }
        }
    );


}