import {Page} from 'react-native-scanbot-sdk/src';

const Pages = {
//export default function Pages(props) {
    /**


     function add(page) {
         Pages.list.push(page);
     }

     function length() {
         console.log('ScanbotDetailImage tamanho Pages = ', Pages.list.length);
     }

     */

    add: async function (page) {
        console.log('ScanbotImage add = ', page);
        Pages.list.push(page);
    },

    length: async function () {
        console.log('ScanbotImage tamanho Pages = ', Pages.list.length);
    },
}

// static props
Pages.list = [];

Pages.selectedPage = null;

export default Pages;
