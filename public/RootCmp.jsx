// const Router = ReactRouterDOM.BrowserRouter
const Router = ReactRouterDOM.HashRouter
const { Route, Routes } = ReactRouterDOM

import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { BugEdit } from './pages/BugEdit.jsx'
import { UserProfile } from './pages/UserProfile.jsx'

export function App() {
    return (
        <Router>
            <div>
                <AppHeader />
                <main className="main-layout">
                    <Routes>
                        <Route path={'/'} element={<Home />} />
                        <Route path={'/bug'} element={<BugIndex />} />
                        <Route path={'/bug/edit'} element={<BugEdit />} />
                        <Route path={'/bug/edit/:bugId'} element={<BugEdit />} />
                        {/* </Route> */}
                        <Route path={'/bug/:bugId'} element={<BugDetails />} />
                        <Route path={'/about'} element={<AboutUs />} />
                        <Route path={'/user'} element={<UserProfile />} />
                    </Routes>
                </main>
                <AppFooter />
            </div>
        </Router>
    )
}
