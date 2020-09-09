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

    add: async function (pages) {
        console.log('ScanbotImage add = ', pages);

        pages.forEach((page) => {
            Pages.list.push(page);
        });
    },

    addList: async function (pages) {
        console.log('ScanbotImage addList = ', pages);

        Pages.list = pages;
    },

    length: async function () {
        console.log('ScanbotImage tamanho Pages = ', Pages.list.length);
    },

    isEmpty: async function () {
        return Pages.list.length === 0;
    },

    update: async function (page) {
        let index = -1;
        for (let i = 0; i < Pages.list.length; i++) {
          if (Pages.list[i].pageId === page.pageId) {
            index = i;
          }
        }

        if (index !== -1) {
          Pages.list[index] = page;
        }
    },

    getImageUris: async function () {
        return Pages.list.map(
          (p) => p.documentImageFileUri || p.originalImageFileUri,
        );
    }
}

// static props
Pages.list = [];

Pages.selectedPage = null;

export default Pages;
