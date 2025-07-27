// data/questionnaireData.js
const questionnaireData = [
  {
    title: 'Face',
    icon: 'happy-outline',
    color: '#992C55',
    description: 'Select one or multiple options',
    questions: [
      {
        type: 'select',
        options: ['Little/natural Makeup', 'Excess Makeup', 'No Makeup'],
        stateKey: 'selectedFace',
      },
    ],
  },
  {
    title: 'Skin',
    icon: 'color-palette-outline',
    color: '#992C55',
    description: 'Select one or multiple options',
    questions: [
      {
        type: 'toggle',
        label: 'Maintain skin tone',
        stateKey: 'maintainSkinTone',
      },
      {
        type: 'radioGroup',
        label: 'Lighter',
        options: ['A little', 'Very light', 'Extremely light'],
        stateKey: 'selectedLighter',
      },
      {
        type: 'radioGroup',
        label: 'Darker',
        options: ['A little', 'Very Dark', 'Extremely Dark'],
        stateKey: 'selectedDarker',
      },
    ],
  },
  {
    title: 'Change in body size',
    icon: 'body-outline',
    color: '#992C55',
    description: 'Select one or multiple options',
    questions: [
      { type: 'textarea', label: 'Eyes', stateKey: 'eyes' },
      { type: 'textarea', label: 'Lips', stateKey: 'lips' },
      {
        type: 'radioGroup',
        label: 'Hips',
        options: ['Wide', 'Very Wide', 'Extremely Wide'],
        stateKey: 'selectedHips',
      },
      {
        type: 'radioGroup',
        label: 'Butt',
        options: ['Big', 'Very Big', 'Extremely Wide'],
        stateKey: 'selectedButt',
      },
      { type: 'textarea', label: 'Height', stateKey: 'height' },
      { type: 'textarea', label: 'Nose', stateKey: 'nose' },
      {
        type: 'radioGroup',
        label: 'Tummy',
        options: ['Small', 'Very Small', 'Extremely Small'],
        stateKey: 'selectedTummy',
      },
      { type: 'textarea', label: 'Chin', stateKey: 'chin' },
      { type: 'textarea', label: 'Arm', stateKey: 'arm' },
      { type: 'textarea', label: 'Other Requirements', stateKey: 'other' },
    ],
  },
];

export default questionnaireData;
