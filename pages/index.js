import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import nookies from 'nookies'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import ProfileRelationsBoxWrapper from '../src/components/ProfileRelations'
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons'

function ProfileSidebar(propriedades) {
  const { githubUser } = propriedades
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${githubUser}.png`}
        style={{ borderRadius: '8px' }}
        alt="github profile"
      />
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${githubUser}`}>
          @
          {githubUser}
        </a>
      </p>

      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox({
  title, items, githubUser,
}) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {title}
        {' '}
        (
        <a
          href={`https://github.com/${githubUser}?tab=${items[1]}`}
          target="_blank"
          rel="noreferrer"
          className="boxLink"
        >

          {items[2]}
        </a>
        )
      </h2>

      <ul>
        {items[0]
        && items[0].map((item, i) => (i > 5 ? false : (
          <li key={item}>
            <a
              href={`https://github.com/${item}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`https://github.com/${item}.png`}
                alt="img"
              />
              <span>{item}</span>
            </a>
          </li>
        )))}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

ProfileRelationsBox.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.instanceOf(Array).isRequired,
  githubUser: PropTypes.string.isRequired,
}

function random(min, max) {
  if (max === undefined) {
    // eslint-disable-next-line no-param-reassign
    max = min
    // eslint-disable-next-line no-param-reassign
    min = 0
  }
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function Home(Props) {
  const { currentUser } = Props
  const { username } = JSON.parse(currentUser)
  const githubUser = username
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [userInfos, setUserInfos] = useState({})
  const [userStatus, setUserStatus] = useState({})
  const [communities, setCommunities] = useState([])
  const img404 = 'https://image.freepik.com/vetores-gratis/erro-404-nao-encontrado-efeito-de-falha_8024-4.jpg'

  useEffect(() => {
    // fetch all user infos
    fetch(`https://api.github.com/users/${githubUser}`)
      .then((response) => {
        if (response.ok) return response.json()

        throw new Error(response.status)
      })
      .then((data) => {
        setUserInfos({
          followers: data.followers,
          following: data.following,
        })
      })
      .catch((err) => {
        console.error(`Erro (${err}) ao carregar ${githubUser}`)
      })

    // fetch followers
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((response) => {
        if (response.ok) return response.json()

        throw new Error(response.status)
      })
      .then((data) => {
        setFollowers(data.map((item) => item.login)
          .sort(() => Math.random() - 0.5))
      })
      .catch((err) => {
        console.error(`Erro (${err}) ao carregar ${githubUser}/followers`)
      })

    // fetch following
    fetch(`https://api.github.com/users/${githubUser}/following`)
      .then((response) => {
        if (response.ok) return response.json()

        throw new Error(response.status)
      })
      .then((data) => {
        setFollowing(data.map((item) => item.login)
          .sort(() => Math.random() - 0.5))
      })
      .catch((err) => {
        console.error(`Erro (${err}) ao carregar ${githubUser}/following`)
      })

    // API GraphQL DATOCMS
    const API_DATOCMS_TOKEN = process.env.NEXT_PUBLIC_API_DATOCMS_TOKEN_READ
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        Authorization: API_DATOCMS_TOKEN,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        query:
        `
      query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
      }`,
      }),
    }).then((response) => response.json())
      .then((data) => {
        const newCommunities = data.data.allCommunities
          .sort(() => Math.random() - 0.5)
        setCommunities([...newCommunities])
      })

    const newStatus = {
      scraps: random(15, 65),
      photos: random(30, 100),
      videos: random(100),
      fans: random(100),
      messages: random(30, 100),
      reliable: random(3),
      nice: random(3),
      sexy: random(3),
    }
    setUserStatus(newStatus)
  }, [])

  function handleCreateCommunity(e) {
    e.preventDefault()
    const dadosDoForm = new FormData(e.target)

    const communityForm = {
      title: dadosDoForm.get('title'),
      imageUrl: dadosDoForm.get('image') === '' ? img404 : dadosDoForm.get('image'),
      creatorSlug: githubUser,
    }

    fetch('/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(communityForm),
    })
      .then(async (response) => {
        const data = await response.json()
        const community = data.record
        const updatedCommunities = [...communities, community]
        setCommunities(updatedCommunities)
      })
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>
        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              Bem-vindo(a),
              {' '}
              {githubUser}
            </h1>
            <OrkutNostalgicIconSet
              recados={userStatus.scraps}
              fotos={userStatus.photos}
              videos={userStatus.videos}
              fas={userStatus.fans}
              mensagens={userStatus.messages}
              confiavel={userStatus.reliable}
              legal={userStatus.nice}
              sexy={userStatus.sexy}
            />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form
              onSubmit={handleCreateCommunity}
            >
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>

              <div>
                <input
                  placeholder="Cole uma URL para usarmos de capa"
                  name="image"
                  aria-label="Cole uma URL para usarmos de capa"
                />
              </div>
              <button type="submit">
                Criar comunidade
              </button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: 'profileRelationsArea' }}
        >
          <ProfileRelationsBox
            title="Seguidores"
            items={[followers, 'followers', userInfos.followers]}
            githubUser={githubUser}
          />

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades  (
              {communities.length}
              )
            </h2>

            <ul>
              {communities.map((item, i) => (i > 5 ? false : (
                <li key={item.id}>
                  <a href={`/communities/${item.id}`}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                    />
                    <span>{item.title}</span>
                  </a>
                </li>
              )))}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBox
            title="Seguindo"
            items={[following, 'following', userInfos.following]}
            githubUser={githubUser}
          />

        </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const currentUser = cookies.CURRENT_USER

  if (!currentUser) {
    nookies.destroy('CURRENT_USER')
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: {
      currentUser,
    }, // will be passed to the page component as props
  }
}
