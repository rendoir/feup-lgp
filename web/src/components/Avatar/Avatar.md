Avatar with image:
```jsx
<div>
    <Avatar
        title="John Doe"
        placeholder="empty"
        size={50}
        image="https://picsum.photos/200/200?image=52"
    />
    <Avatar
        title="Dale Long"
        placeholder="lblue"
        size={50}
        image="https://picsum.photos/200/200?image=34"
    />
    <Avatar
        title="Teresa Leal"
        placeholder="blue"
        size={50}
        image="https://picsum.photos/200/200?image=48"
    />
    <Avatar
        title="Russel Ross"
        placeholder="red"
        size={50}
        image="https://picsum.photos/200/200?image=44"
    />
    <Avatar
        title="James William"
        placeholder="orange"
        size={50}
        image="https://picsum.photos/200/200?image=82"
    />
    <Avatar
        title="Tomas Watson"
        placeholder="green"
        size={50}
        image="https://picsum.photos/200/200?image=107"
    />
    <Avatar
        title="Rachel Greene"
        placeholder="purple"
        size={50}
        image="https://picsum.photos/200/200?image=261"
    />
    <Avatar
        title="Monica Geller"
        placeholder="yellow"
        size={50}
        image="https://picsum.photos/200/200?image=159"
    />
</div>
```

Avatar without image:
```jsx
<div>
    <Avatar title="John Doe" placeholder="empty" size={50} />
    <Avatar title="Dale Long" placeholder="lblue" size={50} />
    <Avatar title="Teresa Leal" placeholder="blue" size={50} />
    <Avatar title="Russel Ross" placeholder="purple" size={50} />
    <Avatar title="James William" placeholder="red" size={50} />
    <Avatar title="Tomas Watson" placeholder="orange" size={50} />
    <Avatar title="Rachel Greene" placeholder="yellow" size={50} />
    <Avatar title="Monica Geller" placeholder="green" size={50} />
</div>
```

Avatar without title:
```jsx
<div>
    <Avatar placeholder="empty" size={50} />
    <Avatar placeholder="lblue" size={50} />
    <Avatar placeholder="blue" size={50} />
    <Avatar placeholder="purple" size={50} />
    <Avatar placeholder="red" size={50} />
    <Avatar placeholder="orange" size={50} />
    <Avatar placeholder="yellow" size={50} />
    <Avatar placeholder="green" size={50} />
</div>
```

Avatar change props test:
```jsx
import Button from '../Button/Button'
initialState = {
    image: null,
};

const status = ['away', 'unset', 'invisible', 'do_not_disturb'];
const handleImageChange = () => {
    setState({
        image: `https://picsum.photos/500/500/?${Math.floor(Math.random() * 200)}`,
    });
};
const handleImageRemove = () => {
    setState({ image: undefined });
};
const handleStatusChange = () => {
    setState({ status: status[Math.floor(Math.random() * status.length)] });
};

<div>
    <div>
        <Button onClick={handleImageChange} theme="primary" size="small">
            Change Image
        </Button>
        <Button onClick={handleImageRemove} theme="warning" size="small" disabled={!state.image}>
            Remove Image
        </Button>
        <Button onClick={handleStatusChange} theme="primary" size="small">
            Randomize Image
        </Button>        
    </div>
    <br />
    <Avatar
        placeholder="empty"
        size={150}
        image={state.image}
        title="John Doe"
        onClick={console.log}
        status={state.status}
    />
</div>
```