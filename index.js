const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')

let link = 'https://www.muztorg.ru/category/czifrovye-pianino?in-stock=1&pre-order=1&page='

const parseFunc = async ()=>{
   try{
      let arrayAll = [] //массив куда все товары будем ложить
      let i = 1; //счетчик страниц
      let flag = false ; // проверка остановки пагинатора
      // i = 8
      while(true){
         console.log('step', i);
         
         await axios.get(link + i)
         .then(res => res.data)
         .then(res => {
            let html = res;
            $ = cheerio.load(html)
            let pagination = $("li.next.disabled").html()
            $(html).find('section.product-thumbnail').each((index,element)=>{
               let item = {
                  price : $(element).find('p.price').text().replace(/\s+/g,''),
                  nameT : $(element).find('div.title').text().trim(),
                  img : $(element).find('div.product-pictures>a:last-child>img').attr('data-src'),
                  link : $(element).find('div.product-pictures>a:last-child').attr("href")
                 
               }
               arrayAll.push(item)
            })
            // console.log(pagination);

            if(pagination !== null){
               flag = true;
            }
            
         })
         .catch(err => console.log(err))
           if(flag) {
              fs.writeFile('myParse.json', JSON.stringify(arrayAll),(err)=>{
                if(err) throw err
                console.log('всего добавлено : ' + arrayAll.length );
                
                 
              })
               break;
            }
            i++;
      }
   } catch(e){
      console.log('error', e);
      
   }
 


}

parseFunc()