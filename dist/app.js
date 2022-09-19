const app = {
    selectors : {
        gamesContent: document.querySelector('article'),
        gameList: document.getElementById('gameContainer'),
        addBasket: document.querySelectorAll('.add-basket')
    },
    veriables: {
        dealId : null,
        jsonRes: null,
        cart: new Array(),
        fav: new Array()
    },
    data: {
        gamesJson : "https://www.cheapshark.com/api/1.0/games?title=batman&onSale=true",
        gameDetail: "https://www.cheapshark.com/api/1.0/games?id="
    },
    actions: {
        getRequest: async(url) => {
            let response = await fetch(url);
            app.veriables.jsonRes = await response.json();
            return app.veriables.jsonRes;
        },
        getGames : async (url) => {
            await app.actions.getRequest(url);
            await app.veriables.jsonRes.sort(function(a, b){return a.cheapest - b.cheapest});
            return app.actions.setGameCards(app.veriables.jsonRes);
        },
        setGameCards : gamesResponse => {
            let index = -1;
            gamesResponse.forEach(element => {
                index += 1;
                let cloneElement = app.selectors.gamesContent.cloneNode(true);
                cloneElement.setAttribute('id', index);
                cloneElement.querySelector('.add-basket').setAttribute('title', gamesResponse[index].external);
                cloneElement.querySelector('.add-basket').setAttribute('id' , index);
                cloneElement.querySelector('.icon-heart').setAttribute('title', gamesResponse[index].external);
                cloneElement.querySelector('.icon-heart').setAttribute('id' , index);
                cloneElement.querySelector('.img-item').style.cssText += 'background-image:url('+gamesResponse[index].thumb + ')';
                cloneElement.querySelector('.name').innerHTML = gamesResponse[index].external;

                //getting game price
                let getPrice = new XMLHttpRequest();
                getPrice.open("GET", app.data.gameDetail+gamesResponse[index].gameID, true);
                getPrice.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        app.veriables.priceData = JSON.parse(this.responseText); 
                        cloneElement.querySelector('.sale-price').innerHTML = app.veriables.priceData.deals[0].price + '$';
                        cloneElement.querySelector('.add-basket').setAttribute('price', app.veriables.priceData.deals[0].price);
                        if(app.veriables.priceData.deals[0].savings > 0){
                            let yuzde = Math.floor(app.veriables.priceData.deals[0].savings).toFixed();
                            cloneElement.querySelector('.retail-price').innerHTML = '% ' + yuzde + ' SALE';
                        }
                    }
                }
                getPrice.send();

                app.selectors.gameList.appendChild(cloneElement);
            });
            app.selectors.gameList.removeChild(app.selectors.gameList.children[0]);
        },
        addBasket : (id, title, price) => {
            if(id in app.veriables.cart){
                app.veriables.cart[id].qty++
            }else {
                let cartItem = {
                    title : title,
                    price : price,
                    qty : 1
                }
                app.veriables.cart[id] = cartItem
            }
            localStorage.setItem('cart', JSON.stringify(app.veriables.cart));
            console.log(localStorage.getItem('cart'));
            console.log(JSON.parse(localStorage.getItem('cart')));
        },
        addFav : (id,title) => {
            if(app.veriables.fav[id] == null & app.veriables.fav[id] == undefined){
                event.target.setAttribute('src', 'https://www.svgrepo.com/show/30066/heart.svg');
                let favItem = {
                    title : title,
                    id : id
                }
                app.veriables.fav[id] = favItem
            }else {
                app.veriables.fav[id] = null;
                event.target.setAttribute('src', 'https://www.svgrepo.com/show/13666/heart.svg');
            }
            localStorage.setItem('fav', JSON.stringify(app.veriables.fav));
            console.log(localStorage.getItem('fav'));
            console.log(JSON.parse(localStorage.getItem('fav')));
        }
    },
    init: async() => {
        try {
            await app.actions.getGames(app.data.gamesJson);;
          }catch(err){
            console.log(err);
        }
    }
}


app.init();