Scroller parent container should have calculated dimensions due internally Scroller user 
[AutoSizer](https://github.com/bvaughn/react-virtualized/blob/master/docs/AutoSizer.md).
Also we have 'onUserScroll' and 'onJSScroll' event handlers which detects how scroll be initiated.

```jsx harmony
const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed gravida neque. Nam tincidunt ultricies ligula sed consequat. Morbi facilisis sapien eget enim mattis gravida a vel justo. Morbi bibendum accumsan leo. Ut malesuada, eros ut egestas venenatis, eros quam sollicitudin nibh, sed pellentesque turpis lacus blandit quam. Donec libero quam, gravida et interdum sit amet, gravida quis ligula. Donec sollicitudin urna quis interdum eleifend. Duis at auctor velit. Nullam maximus eros a tempus tempor. Curabitur tortor purus, auctor non libero at, blandit accumsan sapien. Sed vulputate purus at nulla iaculis tempus. Fusce ut justo porta, viverra justo vitae, mollis enim. Vestibulum tempus justo at facilisis pulvinar.';
              
<div style={{ width: 300, height: 200 }}>
  <Scroller onScroll={() => console.log('onScroll')}>
    {text}
  </Scroller>
</div>
```

'ScrollTo' and 'ScrollToBottom' methods
```jsx harmony
import Button from '../Button/Button';

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sed gravida neque. Nam tincidunt ultricies ligula sed consequat. Morbi facilisis sapien eget enim mattis gravida a vel justo. Morbi bibendum accumsan leo. Ut malesuada, eros ut egestas venenatis, eros quam sollicitudin nibh, sed pellentesque turpis lacus blandit quam. Donec libero quam, gravida et interdum sit amet, gravida quis ligula. Donec sollicitudin urna quis interdum eleifend. Duis at auctor velit. Nullam maximus eros a tempus tempor. Curabitur tortor purus, auctor non libero at, blandit accumsan sapien. Sed vulputate purus at nulla iaculis tempus. Fusce ut justo porta, viverra justo vitae, mollis enim. Vestibulum tempus justo at facilisis pulvinar.';
let scroller = null;
    
<div>
    <div>
      <Button theme='primary' onClick={() => scroller.scrollTo(100)} size='small'>
        Scroll to 100
      </Button>
      <Button theme='primary' onClick={() => scroller.scrollToBottom()} size='small'>
        Scroll to Bottom
      </Button>
    </div>
    <div style={{ width: 300, height: 200 }}>
      <Scroller 
        ref={(scrollerNode) => scroller = scrollerNode}
        onUserScroll={() => console.log('Scrolled by user')}
        onJSScroll={() => console.log('Scrolled by js')}
      >
        {text}
      </Scroller>
    </div>
</div>
```