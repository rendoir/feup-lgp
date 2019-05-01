```jsx
import Button from '../Button/Button';
initialState = {
  image: null,
};

const handleImageChange = () => {
  const imageCode = Math.floor(Math.random() * 200);
  setState({
    image: 'https://picsum.photos/1500/1500?image='+imageCode,
  });
};

<div>
  <Button onClick={handleImageChange} theme="primary" size="small">
    Change image
  </Button>
  <hr />
  <ImagePreloader src={state.image} onChange={console.log}>
    {({ src }) => {
      return <img src={src} width={150} height={150} />;
    }}
  </ImagePreloader>
</div>;
```
