Basic Modal:
```jsx harmony
const {
  ModalProvider,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalClose,
  Button,
} = require('../../components');

initialState = { isOpen: false };

const handleOpen = () => setState({ isOpen: true });
const handleClose = () => setState({ isOpen: false });

<ModalProvider>
  <Button theme='primary' onClick={handleOpen}>
    Open modal
  </Button>
  {state.isOpen ? (
    <Modal onClose={handleClose}>
      <ModalHeader withBorder>
        Simple modal
        <ModalClose onClick={handleClose} />
      </ModalHeader>
      <ModalBody>
        <p>Hello, world!</p>
      </ModalBody>
      <ModalFooter withBorder>Footer content can be placed here</ModalFooter>
    </Modal>
  ) : null}
</ModalProvider>
```

Modal with tabs:
```jsx harmony
const {
  ModalProvider,
  ModalHeader,
  ModalBodyTabs,
  Button,
} = require('../../components');

initialState = { isOpen: false, current: 'one' };

const tabs = [
  { id: 'one', title: 'Tab one title' },
  { id: 'two', title: 'Tab two title' },
  { id: 'three', title: 'Tab three title' },
  { id: 'four', title: 'Tab four title' },
];

const handleOpen = () => setState({ isOpen: true });
const handleClose = () => setState({ isOpen: false });
const handleChange = (screen) => setState({ current: screen });
const renderCurrentTab = () => {
  return <div>{state.current}</div>;
};

<ModalProvider>
  <Button theme='primary' onClick={handleOpen}>
    Open modal with tabs
  </Button>
  {state.isOpen ? (
    <Modal onClose={handleClose}>
      <ModalHeader withBorder>
        Simple modal
      </ModalHeader>
      <ModalBodyTabs
        tabs={tabs}
        current={state.current}
        onChange={handleChange}
      >
        {renderCurrentTab()}
      </ModalBodyTabs>
    </Modal>
  ) : null}
</ModalProvider>
```

Fullscreen Modal:
```jsx harmony
const { 
  ModalProvider,
  ModalHeader,
  ModalBody,
  ModalClose,
  Button
} = require('../../components');

initialState = { isOpen: false };

const handleOpen = () => setState({ isOpen: true });
const handleClose = () => setState({ isOpen: false });

<ModalProvider>
  <Button theme='primary' onClick={handleOpen}>
    Open fullscreen modal
  </Button>
  {state.isOpen ? (
    <Modal fullscreen onClose={handleClose}>
      <ModalClose onClick={handleClose} />
      <ModalHeader>Simple modal</ModalHeader>
      <ModalBody>
        <p>Hi again. I'm inside fullscreen modal!</p>
      </ModalBody>
    </Modal>
  ) : null}
</ModalProvider>
```