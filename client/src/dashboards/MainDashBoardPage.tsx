import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Box, Grid, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Menu as MenuIcon, Search } from '@mui/icons-material';
import { toTitleCase } from '../utils/TitleCase';
import FuzzySearch from 'fuzzy-search';
import { UserContext } from '../contexts/userContext';
import { FeatureContext } from '../contexts/featureContext';
import AgarsonLogo, { ButtonLogo } from '../components/logo/Agarson';
import React, { useContext, useEffect, useState } from 'react';
import { LineChart, PieChart } from '@mui/x-charts';
import ProfileLogo from '../components/logo/ProfileLogo';
import LogoutButton from '../components/buttons/LogoutButton';

function MainDashBoardPage() {
  const navigate = useNavigate()
  const { feature, setFeature } = useContext(FeatureContext)
  const [open, setOpen] = useState(false);
  const [display, setDisplay] = useState(false)
  const [search, setSearch] = useState("");
  const { user } = useContext(UserContext)
  const [features, setFeatures] = useState<{ feature: string, url: string, is_visible?: boolean, icon?: Element }[]>([])
  const [filteredfeatures, setFilteredFeatures] = useState<{ feature: string, url: string, is_visible?: boolean, icon?: Element }[]>([])
  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <Stack direction={'row'} justifyContent={'center'} mr={4}>
        <Box sx={{ py: 2 }}>
          <Link to="/" replace={true} onClick={() => {
            {
              setFeature({ feature: "Dashboard", url: "/" })
              setSearch("")
              navigate("/")
            }
          }}>
            <AgarsonLogo width={60} height={60} title='Go To Dashboard' />
          </Link>
        </Box>
      </Stack>
      <List>
        {filteredfeatures.map((feat, index) => (
          <React.Fragment key={index}>
            {feat && feat.is_visible && < Link style={{ textDecoration: 'none', color: 'black' }} to={feat.url} onClick={() => {
              setFeature({ feature: feat.feature.toUpperCase(), url: feat.url })
              setSearch("")
            }}>
              <Divider />
              <ListItem key={index} disablePadding>
                <ListItemButton sx={{ gap: 1 }} >
                  <ButtonLogo title="" height={25} width={25} />
                  <ListItemText primary={feat.feature.toUpperCase()} />
                </ListItemButton>
              </ListItem>
            </Link >}
          </React.Fragment >

        ))}
        <ListItem sx={{ px: 1, pt: 4 }} key={'sojs'} disablePadding>

          <LogoutButton />
        </ListItem>
      </List>

    </Box >
  );

  useEffect(() => {
    if (search) {
      const searcher = new FuzzySearch(filteredfeatures, ["feature"], {
        caseSensitive: false,
      });
      const result = searcher.search(search);
      setFeatures(result)
    }

    if (!search)
      setFeatures(filteredfeatures)

  }, [search])

  useEffect(() => {
    let tmpfeatures: { feature: string, is_visible?: boolean, url: string }[] = []
    user?.is_admin && tmpfeatures.push({ feature: 'users', is_visible: true, url: "/Users" })
    user?.is_admin && tmpfeatures.push({ feature: 'Company ', is_visible: true, url: "Company" })
    user?.is_admin && tmpfeatures.push({ feature: 'Machines ', is_visible: true, url: "Company" })

    user?.is_admin && tmpfeatures.push({ feature: 'Problems And Solutions ', is_visible: true, url: "Company" })
    user?.is_admin && tmpfeatures.push({ feature: 'Registered Product ', is_visible: true, url: "Company" })
    user?.is_admin && tmpfeatures.push({ feature: 'Service Requests ', is_visible: true, url: "Company" })
    user?.is_admin && tmpfeatures.push({ feature: 'Spare Parts ', is_visible: true, url: "Company" })
    // user?.is_admin && tmpfeatures.push({ feature: 'Visit ', is_visible: true, url: "Visit" })

    //user?.is_admin && tmpfeatures.push({ feature: 'Visits', is_visible: true, url: "/Visit" })




    setFeatures(tmpfeatures)
    setFilteredFeatures(tmpfeatures)

  }, [user])
  return (
    <>

      <Box sx={{ bgcolor: 'rgba(200,0,0,0.8)', width: '100%' }}>
        {/* parent stack */}
        <Stack direction="row" sx={{
          justifyContent: "space-between", alignItems: "center"
        }}
        >
          {/* child stack1 */}
          <Stack direction="row" gap={2} pl={2} justifyContent={'center'} alignItems={'center'}>

            <ProfileLogo />

          </Stack>
          {/* child stack2 */}

          {/* child stack3 */}
          <Stack
            direction="row"
            justifyContent={"center"}
            alignItems="center"
            gap={2}
          >
            <Link to={feature ? feature.url : "/"} onClick={() => {
              {
                setFeature({ feature: "Dashboard", url: "/" })
                setSearch("")
                navigate("/")
                if (feature?.feature == "Dashboard")
                  setDisplay(!display)
              }
            }} replace={true} style={{ textDecoration: 'none' }}>
              <Paper sx={{ ml: 2, p: 1, bgcolor: 'white', boxShadow: 1, borderRadius: 1, borderColor: 'white' }}>
                <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                  <ButtonLogo title="" height={20} width={20} />
                  <Typography variant="button" sx={{ fontSize: 12 }} component="div">
                    {feature?.feature || "Dashboard"}
                  </Typography>
                </Stack>
              </Paper>
            </Link>
            <Stack sx={{ direction: 'column', minWidth: '20%', gap: 2 }}>
              <TextField
                sx={{ position: 'relative', p: 0, m: 0, backgroundColor: 'whitesmoke', border: 2, borderColor: 'white', borderRadius: 2 }}
                placeholder='Search Menu Items'
                size='small'
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search sx={{ cursor: 'pointer' }} />
                    </InputAdornment>
                  ),
                }}
              />

              {search != "" && features.length > 0 && <Box style={{ position: 'absolute', backgroundColor: 'white', top: 48, width: '270px', minHeight: '200px', maxHeight: '400px', borderRadius: 2, border: '5px', zIndex: 5, overflow: 'scroll' }}>
                <List>
                  {features.map((feat, index) => (
                    <>
                      <Link style={{ textDecoration: 'none', color: 'black' }} to={feat.url} onClick={() => {
                        setFeature({ feature: feat.feature.toUpperCase(), url: feat.url })
                        setSearch("")
                      }}>
                        <ListItem key={index} disablePadding>
                          <ListItemButton>

                            <ListItemText primary={toTitleCase(feat.feature)} />
                          </ListItemButton>
                        </ListItem>
                      </Link>
                      <Divider />
                    </>
                  ))}
                </List>
              </Box>}
            </Stack>
            <IconButton onClick={toggleDrawer(true)} size='large'>
              < MenuIcon sx={{ width: 35, height: 35, color: 'white' }} />
            </IconButton>
          </Stack>
        </Stack>
      </Box >



      {feature?.feature == "Dashboard" ?

        <>

          {display ?

            <Stack direction={'row'} gap={2} alignItems={'center'}>
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                  },
                ]}
                width={500}
                height={300}
              />
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: 10, label: 'series A' },
                      { id: 1, value: 15, label: 'series B' },
                      { id: 2, value: 20, label: 'series C' },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
              <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                  {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                    area: true,
                  },
                ]}
                width={500}
                height={300}
              />
            </Stack> :
            <>
              <Grid container sx={{ pt: 2 }} >
                {features.map((feat, index) => {
                  if (feat.is_visible)
                    return (
                      <Grid key={index} item xs={12} md={4} lg={3} sx={{ p: 1 }}>
                        <Link to={feat.url} style={{ textDecoration: 'none' }}
                          onClick={() => {
                            setFeature({ feature: feat.feature.toUpperCase(), url: feat.url })
                            setSearch("")
                          }}
                        >
                          <Paper sx={{ p: 2, m: 0, height: 80, bgcolor: feat.feature.includes('report') ? 'lightblue' : 'white', boxShadow: 2, borderRadius: 5, borderColor: 'white' }} >
                            <Stack flexDirection={"row"} gap={2} sx={{ alignItems: 'center' }}>
                              <ButtonLogo title="" height={50} width={50} />
                              <Typography variant="button" fontSize={15} component="div">
                                {feat.feature.toUpperCase()}
                              </Typography>
                            </Stack>
                          </Paper>
                        </Link>
                      </Grid>
                    )
                })}
              </Grid>
            </>
          }

        </>
        :

        <Outlet />}

      <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
        {DrawerList}
      </Drawer>

    </>

  )
}


export default MainDashBoardPage