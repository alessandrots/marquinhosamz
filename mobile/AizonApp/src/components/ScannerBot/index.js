import React, { useState } from 'react';
import {Page} from 'react-native-scanbot-sdk/src';

const [list, setList] = useState([]);
//https://dev.to/emeka/using-custom-hooks-in-place-of-render-props-38mf
/**
export function useMouse(initialValue = {x:0, y:0}) {
    const [position, setPosition] = useState(initialValue);
    const handleMouseMove = (event) => {
      setPosition({
        x: event.clientX,
        y: event.clientY
      });
    }
    return [position, handleMouseMove];
}
*/
export function add(page) {
    //let listTmp = list;
    //listTmp.push(page);
    //setList(listTmp);

    setList(page);
}

export function cleanList() {
    //let listTmp = list;
    //listTmp.push(page);
    //setList(listTmp);

    setList([]);
}

export function addList(pages) {
    pages.forEach((page) => {
        add(page);
    });
}

export function isEmpty() {
    return (!list && list.length === 0);
}

export function update(page) {
    let index = -1;
    for (let i = 0; i < list.length; i++) {
        let pageTmp = list[i];

        if (pageTmp.pageId === page.pageId) {
            index = i;
        }
    }

    if (index !== -1) {
        list[index] = page;
    }
}

export function getImageUris() {
    return list.map(
        (p) => p.documentImageFileUri || p.originalImageFileUri,
    );
}