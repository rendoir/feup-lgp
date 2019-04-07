```jsx
import Button from '../Button/Button';
initialState = {
  isOpen: false,
};

const handleImageChange = () => {
  setState({
    isOpen: true,
  });
};

<div>
  <Button onClick={handleImageChange} theme="primary" size="small">
    Change image
  </Button>
  <hr />
  <PostModal onChange={console.log}/>
</div>
```