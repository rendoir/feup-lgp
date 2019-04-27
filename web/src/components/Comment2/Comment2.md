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

Comment with replies:
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

const replies = (
  [
    <Comment2
      id={2}
      userId={2}
      avatar={avatar}
      message={
        'this is a reply to a comment!' +
        'this is a reply to a comment!' +
        'this is a reply to a comment!' +
        'this is a reply to a comment!' +
        'this is a reply to a comment!'
      }
      reply
    />,
    <Comment2
      id={3}
      userId={3}
      avatar={avatar}
      message={
        'this is a reply to a comment!' +
        'this is a reply to a comment!' +
        'this is a reply to a comment!' +
        'this is a reply to a comment!' +
        'this is a reply to a comment!'
      }
      reply
    />,
  ]
);

<div>
  <Comment2
    id={1}
    userId={1}
    avatar={avatar}
    message={
      'This is a comment created for testing purposes! ' +
      'This is a comment created for testing purposes! ' +
      'This is a comment created for testing purposes! ' +
      'This is a comment created for testing purposes! ' +
      'This is a comment created for testing purposes!'
    }
    replies={replies}
  />
</div>
```