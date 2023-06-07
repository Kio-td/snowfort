const { resolve } = require('path')
const blessed = require('neo-blessed')
const { json } = require('stream/consumers')
const { Sequelize } = require('sequelize')

let config = {
    token: "",
    homeGuild: "",
    owner: ""
}
exports.setup = async () => {
    new Promise(async resolver => {
    if (!(!!(await require('fs/promises').stat('../config.json').catch(e => false)))) return resolver()
    else {

    const screen = blessed.screen({
        smartCSR: true,
        useBCE: true,
        autoPadding: true,
        sendFocus: true
    })

    let box = blessed.form({
        parent: screen,
        hidden: false,
        mouse: true,
        keys: true,
        tags: true,
        padding: 1,
        top: 'center',
        style: {bg: 'blue'},
        align: 'center',
        left: 'center',
        border: 'line',
        width: '50%',
        height: 9,
        content: 'Welcome to Snowfort!\n\nThis is the Setup Wizard. We\'re going to go through some simple steps to get you up and running.'
    })


    let button = blessed.button({
        parent: box,
        style: {bg: 'black', fg: 'white', focus: {bg: 'red'}, hover: {bg: 'red'}},
        valign: 'middle',
        bottom: 0,
        shrink: true,
        mouse: true,
        keys: false,
        left: "center",
        align: 'center',
        content: "Cool!",
        shrink: true
    })


    let token = blessed.textbox({
        censor: true,
        mouse: true,
        keys: true,
        name: "token",
        shrink: true,
        inputOnFocus: true,
        width: "90%",
        left: 'center',
        bottom: 1
    })

    let botInfo = blessed.box({
        style: {
            bg: 'gray'
            //        bg: ''
        },
        border: 'line',
        tags: true,
        height: 11,
        width: 70,
        top: 7,
        align: 'left',
        left: 'center',
        content:    "{center} ---Setup Progress--- {/center}" +
                    "\n*Introcutions" +
                    "\nEris: Not Connected..." +
                    "\nUser: TBD" +
                    "\nHome Guild: TBD" +
                    "\nOwner: TBD",
                    // "\nDatabase: TBD",
        parent: screen,
        padding: 1
    })

    let tokenHelp = blessed.box({
        hidden: true,
        width: 60,
        height: 17,
        padding: {top: 2, left:1, right:1, bottom: 2},
        shrink: true,
        parent:screen,
        border: 'line',
        align: 'center',
        tags: true,
        left: 'center',
        top: 'center',
        style: {bg: '#b164f3'},
        content: "You need to input a token in order for Snowfort to control the bot.\n\nTo create a bot (& get a token!):\n1.) Go to https://discord.com/developers\n2.) Click 'bot' in the left menu\n3.) Click the 'Add Bot' button.\n3.) Copy the token, and paste it in here!\n\n{black-bg}{red-fg}{underline}Hey! Don't record this token, or give it to anyone!{/}\n{black-bg}{red-fg}{underline}It's the master control key for your bot!{/}"
    })
    tokenHelp.enableDrag()


    let nonValidKey = blessed.box({
        content: "Whoops!\n\nLooks like that's not a valid token.",
        width: 60,
        padding: 1,
        height: 10,
        hidden: true,
        parent:screen,
        border: 'line',
        align: 'center',
        left: 'center',
        top: 'center',
        style: {bg: 'red'},
    })
    let closeNonValidKey = blessed.button({
        content:"x",
        width:1,
        height:1,
        parent: nonValidKey,
        top:-1,
        right:0,
        mouse: true,
        keys: true,
        style: {
            hover: {
                bg: 'blue'
            }
        }
    })

    closeNonValidKey.on('press', () => {nonValidKey.hide();screen.render()})


    let closeTokenHelp = blessed.button({
        content: "x",
        mouse: true,
        shrink: true,
        right: 0,
        top: -1,
        style: {
            bg: "black",
            hover: {
                bg: "red"
            } 
        },
    })

    closeTokenHelp.on('press', () => {
        tokenHelp.hide()
        screen.render()
    })

    let openTokenHelp = blessed.button({
        content: "?",
        mouse: true,
        shrink: true,
        right: 0,
        top: -1,
        style: {
            bg: "black",
            hover: {
                bg: "red"
            } 
        },
    })




    openTokenHelp.on('press', () => {tokenHelp.show(); screen.render()})

    tokenHelp.append(closeTokenHelp)

    button.once('press', () => {
        box.height = 12
        botInfo.setContent(botInfo.content.replace("Eris:", "*Eris:").replace("User:", "*User:").replace("*Introcutions", "✓Introcutions"))
        botInfo.setContent(botInfo.content)
        box.setContent("Let's get connected to your bot!\n\nPlease input your Bot's Token here.\n(Click ? for more info.)\n")
        box.append(openTokenHelp)
        box.append(token)
        button.padding
        button.setContent("Check Token")
        token.focus()
        screen.render()
        const checkToken = () => {
            box.setContent("Checking, please wait!")
            botInfo.setContent(botInfo.content.replace("Not Connected...", "Connecting...").replace("Eris: Error!", "Eris: Connecting..."))
            botInfo.style.bg = "yellow"
            screen.render()
            const eris = new require('eris')(token.getValue(), {getAllUsers: true, intents: 32767})
            eris.on('debug', msg => screen.debug(msg))
            eris.on('ready', () => {
                botInfo.setContent(botInfo.content.replace("Connecting...", "Connected!").replace("*Eris", "✓Eris").replace("*User", "✓User").replace("User: TBD", "User: " + "@" + eris.user.username + "#" + eris.user.discriminator + " {|} <@" + eris.user.id + "> "))
                botInfo.style.bg = "#10ac84"
                button.removeAllListeners()
                token.removeAllListeners()
                config.token = token.getValue()

                // To prevent memory leakage, Setup should delete the windows that are no longer in use.
                // I'll also send them to the void, since they're not required anymore
                token.destroy()
                token = undefined
                openTokenHelp.destroy()
                openTokenHelp = undefined
                closeTokenHelp.destroy()
                closeTokenHelp = undefined
                closeNonValidKey.destroy()
                closeNonValidKey = undefined
                nonValidKey.destroy()
                nonValidKey = undefined
                tokenHelp.destroy()
                tokenHelp = undefined




                const moreSettings = (guild) => {
                    config.homeGuild = guild
                    botInfo.setContent(botInfo.content.replace("*Home Guild: TBD", "✓Home Guild: " + eris.guilds.get(config.homeGuild).name + "{|} <$" + config.homeGuild + "> "))
                    box.setContent("Now, let's find out who you are.\n\nI hate to spoil the party at the mast minute, but I need you to help find yourself!\nPlease enter your User ID.")
                    box.height = 10
                    botInfo.setContent(botInfo.content.replace("Owner: TBD", "*Owner: Creating Command..."))
                    screen.render
                    eris.createGuildCommand(config.homeGuild, {
                        name: "registerowner",
                        description: "Hi, friend! Use this command to register yourself as the owner!",
                        options: [{
                            type: 3,
                            name: "secret",
                            description: "In order for me to know you're _really_ the owner, I need to know the secret I told you.",
                            required: true

                        }]
                    }).then(() => {
                        let secretPassword = ((Math.random() + 1).toString(36).substring(7)).toLowerCase()
                        botInfo.setContent(botInfo.content.replace("*Owner: Creating Command...", "*Owner: Waiting for you!"))
                        eris.once('interactionCreate', interaction => {
                            if (interaction.data.name === "registerowner" && interaction.data.options[0].value.toLowerCase() === secretPassword) {
                                interaction.createMessage({flags: 64, content:":eyes: Hello, my owner! I got your info loud and clear! Head back over to the setup window."}).then(() => {
                                    eris.getGuildCommands(config.homeGuild).then(a => eris.deleteGuildCommand(config.homeGuild, a.find(command => command.name === "registerowner").id))
                                    botInfo.setContent(botInfo.content.replace("*Owner: Waiting for you!", "✓Owner: @" + interaction.member.user.username + "#" + interaction.member.user.discriminator +"{|}<@"+interaction.member.id+"> "))
                                    config.owner = interaction.member.id
                                    box.setContent("We're all donezo for now! I'll pop up when there's been an update to get you up to speed.\n\nFirst, please make sure that the settings above are correct.\nIf they are not, Hit escape for CTRL-C to quit setup and restart.")
                                    let lb = blessed.button({
                                        parent: box,
                                        style: {bg: 'black', fg: 'white', focus: {bg: 'red'}, hover: {bg: 'red'}},
                                        valign: 'middle',
                                        bottom: 0,
                                        shrink: true,
                                        mouse: true,
                                        keys: false,
                                        left: "center",
                                        align: 'center',
                                        content: "Looks good! Save!",
                                        shrink: true
                                    })
                                    lb.on('press', () => {
                                        require('fs').writeFileSync('./config.json', JSON.stringify(
                                            {
                                                __protected: {
                                                    Bot: {
                                                        Token: config.token
                                                        
                                                    },
                                                    "Disabling Sanity is a bad Idea.": "Disabling the Sanitizer is a bad idea, and is only kept in the config for the 'very special circumstances'. 9/10 people who ask you to turn this off are scamming you.",
                                                    disableSanitizer: false
                                                },
                                                home: config.homeGuild,
                                                owner: config.owner
                                            }
                                        ))
                                        box.setContent("config.json has been written!\n\nEnjoy Snowfort. <3")
                                        lb.setContent("Bye, Wizard!")
                                        lb.focus()
                                        screen.render()
                                        lb.on('press', () => {
                                            eris.disconnect()
                                            screen.destroy()
                                            return resolver()
                                        })
                                    })
                                    lb.show()
                                    lb.focus()
                                    screen.render()
                                })
                                

                            } else {
                                interaction.createMessage({flags: 64, content: ":warning: Nope, that's not right. Try again!" })
                            }
                        })

                        box.setContent("I now need to identify you! In '" + eris.guilds.get(config.homeGuild).name + "', I've made a command called /registerowner.\n\nYour secret is {black-bg} " + secretPassword + " {/}.")
                        box.height = 10
                        screen.render()
    // \x07 - ANSI bell character     
                    })
                }
                button.hide()
                botInfo.setContent(botInfo.content.replace("Home Guild:", "*Home Guild:"))
                if (eris.guilds.length === 0) {
                    box.height = 7
                    box.setContent("Helloooo? Is anyone there...?\n\nLook's like you didn't invite your bot to your home server. Please do that before we continue.")
                    let addBot = blessed.box({
                        parent: screen,
                        bg: '#b164f3',
                        shrink: true,
                        padding: 1,
                        hidden: true,
                        mouse: true,
                        keys: true,
                        left: 'center',
                        top: 'center',
                        border: 'line',
                        content: "To add your bot to a server for the first time, you need to create an oAuth link.\n"+
                                "\n"+
                                "You can do so by going to your bot's panel, clicking oAuth, then URL Generator.\n" +
                                "In the scopes field, select 'bot' and 'applications.commands', and in bot permissions,\n" +
                                "select 'Administrator'. The link should be at the bottom of the page!"
                    })
                    let closeaddBot = blessed.button({
                        content:"x",
                        shrink: true,
                        parent: addBot,
                        mouse: true,
                        keys: true,
                        top: 0,
                        style: {
                            focus: {bg: "red"},
                            hover: {bg: "red"}
                        },
                        right: 0
                    })
                    let addBotButton = blessed.button({
                        content: "?",
                        shrink: true,
                        mouse: true,
                        keys: true,
                        top: 0,
                        style: {
                            focus: {bg: "red"},
                            hover: {bg: "red"}
                        },
                        right: 0
                    })
                    addBotButton.on('press', () => {addBot.show();screen.render()})
                    closeaddBot.on('press', () => {addBot.hide();screen.render()})
                    button.hide()
                    eris.once('guildCreate', moreSettings(guild.id))
                } else if (eris.guilds.length === 1) moreSettings(eris.guilds.find(() => true).id)
                else {
                    box.setContent("Please select your home guild!\n\n")
                    let serverList = blessed.list({
                        parent: box,
                        scroll: true,
                        style: {
                        selected: {
                            bg: 'red',
                            fg: 'white',
                        },
                        },
                        mouse: true,
                        keys: true,
                        bottom: 0,
                        interactive: true,
                        height: 4
                    })
                    eris.guilds.forEach(guild => {serverList.add(guild.name + " <$"+guild.id+">"); screen.render()})
                    serverList.focus()

                    serverList.on('select', item => {
                        serverList.hide()
                        moreSettings(item.content.slice(item.content.lastIndexOf("<$") - item.content.length).replace("<$","").replace(">",""))

                    })
                }
                screen.render()
                
            })
            eris.on('error', error => {
                botInfo.setContent(botInfo.content.replace("Connecting...", "Error!"))
                botInfo.style.bg = "red"
                screen.debug(error)
                nonValidKey.setContent(nonValidKey.content + "\nEris said: " + error)
                nonValidKey.show()
                screen.render()
            })
            eris.connect()
        }
        token.on('submit', checkToken)
        button.on('press', checkToken)
    })


    // I have nothing I need to store.
    // I'm tired as fuck.
    // Ferny, fix it for me.

    // botInfo.setContent(botInfo.content.replace("Database", "*Database"))
    // box.setContent("Almost there!\n\nWe're at the hardest part, and I promise, it's not going to be hard.\nWe use a database manager that has support for mulitple languages.\nWhich one are you comfortable using?\n(Hint: SQLite is the easiest to setup.)")
    // let sqList = blessed.list({
    //     selected: {
    //         bg: 'red',
    //         fg: 'white',
    //     },
    //     parent: box,
    //     mouse: true,
    //     keys: true,
    //     interactive: true,
    //     width: 15,
    //     height: 5,
    //     align: 'center',
    //     bottom: 0,
    //     left: 'center',
    //     items: ["sqlite", "mysql", "mariadb", "postgres", "mssql"]
    // })
    // button.hide()
    // sqList.focus()
    // box.height = 16
    // sqList.on('select', async choice => {
    //     sqList.hide()
    //     const decision = choice.content.replace("postgres", "pg").replace("MSQL", "tedious").replace("sqlite", "sqlite3").replace("mysql", "mysql2")
    //     box.setContent("Ah, "+choice.content+". Good choice!")
    //     switch (decision) {
    //         case "sqlite3":
    //             botInfo.setContent(botInfo.content.replace("*Database: TBD", "Database: SQLite"))
    //             config.database.dialect = "sqlite"
    //             config.database.storage = "../database.sqlite"
    //             const centralDB = new Sequelize(...config.database)

    //     }
    //     screen.render()
    // })



    screen.key(['tab'], () => screen.focusNext())
    screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
    button.focus()
    screen.render()
}
})
}