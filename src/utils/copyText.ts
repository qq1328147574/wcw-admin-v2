import { Message } from 'element-ui';
import { Notify } from 'vant';
const onCopyText = (text)=> {
  const input = document.createElement('input');
  document.body.appendChild(input);

  input.setAttribute('value',text);
  input.select();
  
  document.execCommand("Copy");
  input.remove();

  Notify.clear();
  Notify({
    type: 'success',
    message: '已复制'
  })
}


export default onCopyText