'use strict'
let itemsInCart =[];
const user_id = 123;

class BasicItem{
  constructor(params){
    this.id = params.id;
    this.title = params.title;
    this.price = params.price;
  }

  _createRow(){
    const row = document.createElement('div');
    row.className = 'row'
    return row
  }

  draw(placeholder){
    document.querySelector(placeholder).appendChild(this._createWrapper());
    return this
  }
}

class ItemCard extends BasicItem{
  constructor(params){
    super(params);
    this.imageUrl = params.imageUrl;
  }
  
  _createWrapper(){
    const wrapper = document.createElement('div');
    wrapper.className = "card itemcard-wrapper ";
    wrapper.setAttribute("style", "width: 250px;");
    wrapper.dataset.id = this.id;
    wrapper.appendChild(this._createImg());
    wrapper.appendChild(this._createBody());
    return wrapper
  }

  _createImg(){
    const img = document.createElement('img');
    img.className = 'card-img-top';
    img.src = this.imageUrl;
    return img
  }

  _createBody(){
    const itembody = document.createElement('div');
    itembody.className = "card-body";
    itembody.appendChild(this._createTitle());
    itembody.appendChild(this._createPrice());
    itembody.appendChild(this._createForm());
    itembody.appendChild(this._createButton());
    return itembody;
  }

  _createTitle(){
    const itemtitle = document.createElement('h4');
    itemtitle.className = 'card-title';
    itemtitle.innerText = this.title 
    return itemtitle;
  }

  _createPrice(){
    const ppp = document.createElement('p');
    ppp.className = 'card-price';
    ppp.innerText = this.price;
    return ppp;
  }

  _createForm(){
    const form = document.createElement('form');
    form.appendChild(this._createFormGroup('Title'));
    form.appendChild(this._createFormGroup('Price'));
    return form;
  }

  _createFormGroup(elem_name){
    const fg = document.createElement('div');
    fg.className = 'form-group';
    fg.appendChild(this._createLabel(elem_name));
    fg.appendChild(this._createInput(elem_name));
    return fg
  }

  _createLabel(elem_name){
    const label = document.createElement('label');
    label.className = 'form-control-label';
    label.innerText = elem_name;
    label.htmlFor = `item${elem_name}`;
    return label;
  }

  _createInput(elem_name){
    const input = document.createElement('input');
    input.className = 'form-control';
    input.id = `item${elem_name}`;
    input.type = 'text';
    input.placeholder = `Put a new ${elem_name}`;
    return input
  }

  _createButton(){
    const btn = document.createElement('a');
    btn.href = '#';
    btn.className = 'btn btn-primary';
    btn.innerText = 'To cart!';
    btn.addEventListener('click',()=>{
      // ечли объект с таким id уже в корзине, добавляем ему +1
      // еслиегонет, добавляем новую строку
        for (var item in itemsInCart) {
          if(itemsInCart[item].id === this.id){
            const it = itemsInCart[item];
            it.addItem();
            return true;
          }
        }
        const it = new ItemInCart({id: this.id, title: this.title, price: this.price})
        itemsInCart.push(it);
        update_total();
        it.draw('#itemsInCart');
    });
    return btn
  }
}

class ItemInCart extends BasicItem{
  constructor(params){
    super(params);
    this.amount = 1;
  }

  _createWrapper(){
    const wrapper = document.createElement('div');
    wrapper.className = 'card itemInCard';
    wrapper.dataset.id = this.id;
    wrapper.setAttribute("style", "width: 100%;");
    wrapper.appendChild(this._createBody());
    return wrapper
  }

  _createBody(){
    const body = document.createElement('div');
    body.className = 'card-body';
    const row = body.appendChild(this._createRow())
    row.appendChild(this._createCol(this.title, 'title'))
    row.appendChild(this._createCol(this.price, 'price'))
    row.appendChild(this._createButtonCol())
    row.appendChild(this._createCol(this.price * this.amount, 'sum'));
    return body
  }

  _createCol(el, col_type){
    const col = document.createElement('div');
    col.className = 'col';
    col.innerText = el;
    col.dataset.col_type = col_type;
    return col
  }

  _createButton(klass, text){
    const b = document.createElement('button');
    b.className = klass;
    b.innerText = text;
    if(text === '-'){
      b.addEventListener('click',()=>{
        this.deleteItem();
        if(this.amount == 0){
          this.unDraw();
        }else{
          this.update_amount();
        }
      })
    }
    if(text === '+'){
      b.addEventListener('click',()=> {
        this.addItem();
      })
    }
    return b;
  }

  _createSpan(){
    const s = document.createElement('span');
    s.innerText = this.amount;
    return s;
  }
  _createButtonCol(){
    const b = document.createElement('div')
    b.className = 'col amount';
    b.appendChild(this._createButton('btn btn-danger', '-'));
    b.appendChild(this._createSpan());
    b.appendChild(this._createButton('btn btn-success','+'));
    return b;
  }



  addItem(){
    this.amount++;
    this.update_amount();
    update_total();
  }

  deleteItem(){
    this.amount--;
    update_total();
  }

  unDraw(){
    const index = itemsInCart.indexOf(this);
    itemsInCart.splice(index, 1);
    document.querySelector(`.itemInCard[data-id='${this.id}']`).remove();
    update_total();
  }

  update_amount(){
    document.querySelector(`.itemInCard[data-id='${this.id}'] div.amount span`).innerText = this.amount;
    update_total();
  }
}

const count_total = function(){
  let total = 0;
  for (var item in itemsInCart) {
    total += itemsInCart[item].amount * itemsInCart[item].price;
  }
  return total
}

const draw_total = function(total){
  document.querySelector('span#total_price').innerText = total;  
}

const update_total = function(){
  draw_total(count_total());
}

const send_cart = function(){
   
  console.log(JSON.stringify({user_id: user_id, order: itemsInCart, total: count_total()}))
}

document.querySelector('button#submit_cart').addEventListener('click', send_cart)

// id, title, price, imageUrl
const incoming_json = `[
  {\"id\":1,\"title\":\"title1\",\"price\":3.3,\"imageUrl\":\"http://lorempixel.com/318/180\"},
  {\"id\":2,\"title\":\"title2\",\"price\":23.3,\"imageUrl\":\"http://lorempixel.com/318/180\"},
  {\"id\":3,\"title\":\"title3\",\"price\":123.3,\"imageUrl\":\"http://lorempixel.com/318/180\"},
  {\"id\":4,\"title\":\"title4\",\"price\":223.3,\"imageUrl\":\"http://lorempixel.com/318/180\"},
  {\"id\":5,\"title\":\"title5\",\"price\":3.5,\"imageUrl\":\"http://lorempixel.com/318/180\"}
]`

// console.log(JSON.parse(incoming_json))

let cards = JSON.parse(incoming_json).map(el=>{
  const card = new ItemCard(el);
  card.draw('#place');
  return card;
})



// const cart = new ItemInCart({id: 1, title: 'title', price: 3.3})

// itemsInCart.push(cart)
// cart.draw('#itemsInCart');
// update_total();
