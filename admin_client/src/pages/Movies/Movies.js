import React, {useEffect, useRef, useState} from "react";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '~/api/api'
import {Form, Table, Button} from 'react-bootstrap';

import AddMovie from "./AddMovie"
import DeleteMovie from "./DeleteMovie";
import EditMovie from "./EditMovie";

import BreadcrumbExample from "~/components/Layout/components/BreadcrumbExample/BreadcrumbExample";

import classNames from "classnames/bind"
import styles from "./Movie.module.scss"
import formatReleaseDate from "~/components/formatReleaseDate";
import {MDBBadge, MDBContainer} from "mdb-react-ui-kit";
import highlightKeyword from "~/components/highlightKeyword";
import CircularProgressBarVote from "~/components/CircularProgressBar";
import SearchInput from "~/components/SearchInput/SearchInput";

const cx = classNames.bind(styles)

function ListMovies() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [link, setLink] = useState('');

    useEffect(() => {
        api.get('/movies')
            .then(response => {
                setMovies(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        api
            .post("/movie/add-link", {link})
            .then((response) => {
                setLink("");
                toast.success('Movie added successfully!', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            })
            .catch((error) => {
                toast.error('Error adding movie!', {
                    position: "bottom-center",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                console.error(error);
            });
    };

    const actionArray = [
        {
            type: 'component',
            component: (movie) => (
                <EditMovie
                    cx={cx}
                    movie={movie}
                />
            ),
        },
        {
            type: 'component',
            component: (movie) => (
                <DeleteMovie
                    cx={cx}
                    styles={styles}
                    movie={movie}
                    movies={movies}
                    setMovies={setMovies}
                />
            ),
        },
    ]

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const filteredMovies = movies.filter((movie) => {
        const idMatch = movie.id.toString().includes(searchTerm);
        const titleMatch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const overviewMatch = movie.overview.toLowerCase().includes(searchTerm.toLowerCase());
        return idMatch || titleMatch || overviewMatch;
    });


    return (
        <>
            <BreadcrumbExample/>
            <AddMovie
                cx={cx}
            />

            <div
                className={'mt-3 mb-3 d-flex align-items-center justify-content-between'}
                style={{fontSize: 'var(--default-font-size'}}
            >
                <SearchInput
                    searchTerm={searchTerm}
                    handleSearch={handleSearch}
                />

                <div className={'d-flex align-items-center'}>
                    {/*<span className={'bold mb-3'}>Enter link to add</span>*/}

                    <Form onSubmit={handleSubmit} style={{display: 'flex'}}>
                        <Form.Group controlId="linkInput">
                            {/*<Form.Label>Enter Link</Form.Label>*/}
                            <Form.Control
                                type="text"
                                name="json"
                                placeholder="Enter movie id to add"
                                style={{
                                    minWidth: '180px',
                                    height: '40px',
                                    fontSize: 'var(--default-font-size)',
                                    borderRadius: '10px'
                                }}
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            style={{height: '40px', fontSize: 'var(--default-font-size)'}}
                            className={'ms-3'}
                        >
                            Add
                        </Button>
                    </Form>
                </div>
            </div>

            <Table striped bordered hover>
                <thead>
                <tr className={cx('table-movie-category')}>
                    <th>ID</th>
                    <th>Movie Title</th>
                    <th>Release Date</th>
                    <th>Production Country</th>
                    <th>Overview</th>
                    <th>Rating</th>
                    <th>Action</th>
                </tr>

                </thead>
                <tbody>
                {filteredMovies
                    .sort((a, b) => a.id - b.id)
                    .map((movie) =>
                        movie ? (
                            <tr key={movie._id}>
                                <td style={{textAlign: "center"}}>
                                    {highlightKeyword(movie.id, searchTerm)}
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <img
                                            src={
                                                movie.poster_path.startsWith("/")
                                                    ? `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`
                                                    : movie.poster_path
                                            }
                                            alt="{user.title}"
                                            style={{width: "45px", height: "45px"}}
                                            className="rounded-circle"
                                        />
                                        <div className="ms-3">
                                            <p className="fw-bold mb-1 limitLineClassName">
                                                {highlightKeyword(movie.title, searchTerm)}
                                            </p>
                                            <p className="mb-0">
                                                {movie.genres
                                                    && movie.genres
                                                        .map((genre) => genre.name)
                                                        .join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td style={{textAlign: "center"}}>
                                    {formatReleaseDate(movie.release_date)}
                                </td>
                                <td>
                                    {movie.production_countries
                                        && movie.production_countries
                                            .map((country) => (
                                                <MDBBadge color={'info'} pill>
                                                    {country.name}
                                                </MDBBadge>
                                            ))
                                    }
                                </td>
                                <td>
                                    <div className="ms-3">
                                        <p
                                            className="fw-bold mb-1"
                                            style={{
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                display: "-webkit-box",
                                                WebkitLineClamp: "3",
                                                WebkitBoxOrient: "vertical",
                                            }}

                                        >
                                            {highlightKeyword(movie.overview, searchTerm)}
                                        </p>
                                    </div>
                                </td>
                                <td>
                                    {
                                        movie.vote_count_user !== 0 ? (
                                            <div className={cx('movie-rating')}>
                                                <CircularProgressBarVote
                                                    value={(movie.vote_average_user * 10)}
                                                    text={`${(movie.vote_average_user * 10)}%`}
                                                />
                                                {/*<p className="fw-bold mb-1 limitLineClassName">*/}
                                                {/*    {movie.vote_average_user}*/}
                                                {/*</p>*/}
                                                <p className="text-muted mb-0">
                                                    {movie.vote_count_user} ratings
                                                </p>
                                            </div>
                                        ) : (
                                            <div className='d-flex justify-content-center'>
                                                No ratings available
                                            </div>
                                        )
                                    }
                                </td>
                                <td>
                                    {actionArray.map((action, index) => (
                                        <React.Fragment key={index}>
                                            {action.component(movie)}
                                        </React.Fragment>
                                    ))}
                                </td>
                            </tr>
                        ) : (
                            <tr key="no-movies">
                                <td colSpan="5">
                                    <h1 className="d-flex justify-content-center">Không có phim nào</h1>
                                </td>
                            </tr>
                        )
                    )}
                </tbody>

            </Table>

            <ToastContainer/>
        </>
    );
}

export default ListMovies;



