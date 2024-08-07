import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const statusMap = {
  Awaiting: {
    icon: <Feather name="clock" size={15} />,
    bgColor: '#E4DDF4',
    color: '#7756C9',
    cardColor: '#E4DDF4',
  },
  Ongoing: {
    icon: <Feather name="clock" size={15} />,
    bgColor: '#E0F6FF',
    color: '#45AEF4',
  },
  Completed: {
    icon: <AntDesign name="checkcircleo" size={12} />,
    bgColor: '#D1F0D6',
    color: '#097E52',
  },
  Accepted: {
    icon: <AntDesign name="checkcircleo" size={12} />,
    bgColor: '#D1F0D6',
    color: '#097E52',
    cardColor: '#D1F0D6',
  },
  Cancelled: {
    icon: <AntDesign name="closecircleo" size={12} />,
    bgColor: '#FFF0F0',
    color: '#F50303',
  },
};
