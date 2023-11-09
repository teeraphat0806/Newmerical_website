import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { yellow } from '@mui/material/colors';
export default function TemporaryDrawer({state,setState,toggleDrawer}) {
  
  const list = (anchor) => (
    <Box
      sx={{
        width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,
        backgroundColor: '#1B1B1B', // This sets the background color to black
        color: 'white', // This sets the text color to white for better readability
        '& .MuiListItemIcon-root': { // This changes the icon color to grey or any color you prefer
          color: yellow[500],
        },
      }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {["Bisection", "Newton Ralpson", "One point Iteration", "Cramer rule","Conjugate Gradient","False Position Method","Graphical method","Guaess Jordan","Guaess Seidel","Guaess elimination","LU Decomposite","Lagrange","Matrix Inversion","Newton Divide","Regression","Secant method","SimpsonsRule","Trapzoidal"].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton href={`/${text.toLocaleLowerCase()}`}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
    </Box>
  );

  return (
    <div>
      {['left'].map((anchor) => (
        <React.Fragment key={anchor}>
          
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{ 
              '& .MuiDrawer-paper': { // Target the Drawer's paper
                backgroundColor: 'black', // Set the background color to black
                color: 'white' // Set the text color to white
              }
            }}
          >
            {list(anchor)}
          </Drawer>

        </React.Fragment>
      ))}
    </div>
  );
}