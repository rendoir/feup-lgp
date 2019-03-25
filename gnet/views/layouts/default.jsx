var React = require('react');

class DefaultLayout extends React.Component {
    render() {
        return (
            <html lang="en">
            <head>
                <title>{this.props.title}</title>

                <meta charSet={"utf-8"}/>
                <meta name={"application-name"} content={"gnet"}/>
                <meta name={"description"} content={"gnet is a social network for medical enthusiastics."}/>
                <meta name={"author"} content={"LGP Team 3A"}/>
                <meta name={"keywords"} content={"gnet social network medical glintt lgp"}/>
                <meta name={"viewport"} content={"width=device-width, initial-scale=1, shrink-to-fit=no"}/>

                <link rel={"stylesheet"} href={"bootstrap/css/bootstrap.css"}/>
                {/*<link rel={"stylesheet"} href={"stylesheets/homepage.css"}/>*/}
                <link rel={"stylesheet"} href={"stylesheets/style.css"}/>
                <link rel={"stylesheet"} href={"https://use.fontawesome.com/releases/v5.7.2/css/all.css"}
                      integrity={"sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr"}
                      crossOrigin={"anonymous"}/>

                <script src={"https://code.jquery.com/jquery-3.3.1.slim.min.js"}
                        integrity={"sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"}
                        crossOrigin={"anonymous"} defer/>
                <script src={"https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"}
                        integrity={"sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1"}
                        crossOrigin={"anonymous"} defer/>
                <script src={"https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"}
                        integrity={"sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM"}
                        crossOrigin={"anonymous"} defer/>
            </head>
            <body>
            <header>
                <nav className={"navbar navbar-expand-lg navbar-dark bg-primary"}>
                    <a className={"navbar-brand"} href={"#"}> <i className={"fas fa-clinic-medical fa-lg"}/> gNet</a>
                    <button className={"navbar-toggler"} type={"button"} data-toggle={"collapse"}
                            data-target={"#navbarColor01"} aria-controls={"navbarColor01"} aria-expanded={"false"}
                            aria-label={"Toggle navigation"}>
                        <span className={"navbar-toggler-icon"}/>
                    </button>

                    <div className={"collapse navbar-collapse"} id={"navbarColor01"}>
                        <ul className={"navbar-nav mr-auto"}>
                            <li className={"nav-item active"}>
                                <a className={"nav-link"} href={"#"}>Home <span
                                    className={"sr-only"}>(current)</span></a>
                            </li>
                            <li className={"nav-item"}>
                                <a className={"nav-link"} href={"#"}>Loja <span
                                    className={"sr-only"}>(current)</span></a>
                            </li>
                        </ul>
                        <div className={"dropdown"}>
                            <button id={"dropdownCategories-btn"} className={"btn btn-primary dropdown-toggle"}
                                    type={"button"} data-toggle={"dropdown"} aria-haspopup={"true"}
                                    aria-expanded={"false"}>Search type
                            </button>
                            <div className={"dropdown-menu"}>
                                <a className={"dropdown-item"} href={"#"}><i
                                    className={"fas fa-book-medical"}/> Documents</a>
                                <a className={"dropdown-item"} href={"#"}><i className={"fas fa-user"}/> Users</a>
                                <a className={"dropdown-item"} href={"#"}><i className={" fas fa-align-justify"}/> Posts</a>
                            </div>
                        </div>
                        <form className={"form-inline my-2 my-lg-0"}>
                            <input className={"form-control mr-sm-2"} type={"text"} placeholder={"Search"}/>
                            <button className={"form-control btn btn-secondary my-2 my-sm-0 fas fa-search"}
                                    type={"submit"}/>
                        </form>
                        <a className={"nav-link"} href={"#"}><span className={"text-white h3 pl-3"}><i
                            className={"fas fa-user-md"}/></span></a>
                    </div>
                </nav>
            </header>
            <main role={"main"}>
                <div className={"container m-0 p-0"}>
                    {this.props.children}
                </div>
            </main>
            <footer className={"mt-5"}>
                <p>© 2019 gNet. · <a href={"#"}>Privacy</a> · <a href={"#"}>Terms</a></p>
                <p><a href={"#"}>Back to top</a></p>
            </footer>
            </body>
            </html>
        );
    }
}

module.exports = DefaultLayout;