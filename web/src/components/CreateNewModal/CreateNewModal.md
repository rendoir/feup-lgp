```jsx harmony
import Button from '../Button/Button';
const { PeerInfoSelectorState } = require('./index');
const initial = {
  isOpen: false,
  step: 'type',
  request: {
    type: 'post',
    title: '',
    shortname: '',
    about: '',
    avatar: undefined,
  },
};
initialState = initial;

const handleOpen = () => setState({ isOpen: true });
const handleClose = () => setState(initial);
const handleRequestChande = (request) => setState({ request });
const handleStepChange = (step) => setState({ step });
const handleSubmit = (request) => {
  console.log(request);
  setState(initial);
};

<div>
  <Button theme={'primary'} onClick={handleOpen}>
    Create New
  </Button>
  { state.isOpen ? (
      <CreateNewModal
        isOpen={state.isOpen}
        step={state.step}
        request={state.request}
        shortnamePrefix={''}
        onClose={handleClose}
        maxGroupSize={4}
        onRequestChange={handleRequestChande}
        onStepChange={handleStepChange}
        onSubmit={handleSubmit}
      />
    ) : null }
</div>
```