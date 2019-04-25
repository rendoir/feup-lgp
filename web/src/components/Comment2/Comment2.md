Basic Comment:
```jsx harmony
const {
  Avatar
} = require('../../components');

const avatar = (
  <Avatar
    title="John Doe"
    placeholder="empty"
    size={40}
    image="https://picsum.photos/200/200?image=52"
  />
);

<div>
  <Comment2
    id={1}
    userId={1}
    avatar={avatar}
    message={
      'This is a comment created for testing purposes!'
    } 
  />
</div>
```