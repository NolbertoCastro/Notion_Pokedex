require('dotenv').config()

const axios = require('axios')
const {Client} = require('@notionhq/client')

const notion = new Client({auth: process.env.NOTION_KEY})

const pokeArray = []

async function getPokemon() {
    await axios.get('https://pokeapi.co/api/v2/pokemon/2')
    .then((poke) => {
        const pokeData = {
            "name": poke.data.name,
            "number": poke.data.id,
            "hp": poke.data.stats[0].base_stat,
            "height": poke.data.height,
            "weight": poke.data.weight,
            "attack": poke.data.stats[1].base_stat,
            "defense": poke.data.stats[2].base_stat,
            "special-attack": poke.data.stats[3].base_stat,
            "special-defense": poke.data.stats[4].base_stat,
            "speed": poke.data.stats[5].base_stat,
        }

        pokeArray.push(pokeData)
        console.log(`Fetching ${pokeData.name} from PokeAPI.}`)
    })
    .catch((error) => {
        console.log(error)
    })

    createNotionPage()
}

getPokemon()

async function createNotionPage() {

    for (let pokemon of pokeArray){

        console.log("Sending data to Notion")
        const response = await notion.pages.create({
            "parent": {
                "type": "database_id",
                "database_id": process.env.NOTION_DATABASE_ID
            },
            "properties":{
                "Name":{
                    "title": [
                        {
                            "type": "text",
                            "text":{
                                "content": pokemon.name
                            }
                        }
                    ]
                },
                "No":{
                    "number": pokemon.number
                },
                "HP": { "number": pokemon.hp},
                "Attack": { "number": pokemon.attack},
                "Defense": { "number": pokemon.defense},
                "Sp. Attack": { "number": pokemon['special-attack']},
                "Sp. Defense": { "number": pokemon['special-defense']},
                "Speed": { "number": pokemon.speed},
                "Height": { "number": pokemon.height},
                "Weight": { "number": pokemon.weight},
            }
        })
        console.log(response)
    }
}