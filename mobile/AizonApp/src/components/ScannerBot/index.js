import React from 'react';
import {Page} from 'react-native-scanbot-sdk/src';

//https://stackoverflow.com/questions/61794260/react-native-how-to-use-usestate-in-another-function

/*
const ScannerBot = ([_list = []] = []) => {
    const [list, setList] = useState([]);

    const {current: setList} = useRef(function setList([_list = []] = []) {
        setList(list);
    });

    return [ [list], setList ];
};
*/

export function add(page, fnSetList) {
    //let listTmp = list;
    //listTmp.push(page);
    //setList(listTmp);

    fnSetList(page);
}

export function cleanList(fnSetList) {
    //let listTmp = list;
    //listTmp.push(page);
    //setList(listTmp);

    fnSetList([]);
}

export function addList(pages, fnSetList) {
    pages.forEach((page) => {
        add(page, fnSetList);
    });
}

export function isEmpty(list) {
    return (!list && list.length === 0);
}

export function update(page, list, fnSetList) {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
        let pageTmp = list[i];

        if (pageTmp.pageId === page.pageId) {
            index = i;
        }
    }

    if (index !== -1) {
        //list[index] = page;
        fnSetList(page);
    }
}

export function getImageUris(list) {
    return list.map(
        (p) => p.documentImageFileUri || p.originalImageFileUri,
    );
}