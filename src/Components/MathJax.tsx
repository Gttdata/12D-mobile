import MathJax from 'react-native-mathjax';
import React from 'react';

interface MathJaxProps {
    text:string;
}

const MathJaxComponent:React.FC<MathJaxProps> = ({text}) => {
    return (
        <MathJax
            horizontal={false}
            showsVerticalScrollIndicator={false}
            color={'#333333'}
            style={{
                backgroundColor:'transparent',
            }}
            fontSize={'huge'}
            fontCache={true}
            html={`<div style="font-size: 16px;"> ${text} </div>`}
        />
    );
};

export default MathJaxComponent;