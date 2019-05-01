```jsx
import Button from '../Button/Button';
initialState = {
  Video: null,
};

const handleVideoChange = () => {
  const VideoCode = Math.floor(Math.random() * 200);
  setState({
    Video: 'https://picsum.photos/1500/1500?Video='+VideoCode,
  });
};

<div>
  <Button onClick={handleVideoChange} theme="primary" size="small">
    Change Video
  </Button>
  <hr />
  <VideoPreloader src={state.Video} onChange={console.log}>
    {({ src }) => {
      return <img src={src} width={150} height={150} />;
    }}
  </VideoPreloader>
</div>;
```
