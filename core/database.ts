import { Client } from "eris"
import { Sequelize, Model, DataTypes } from "sequelize"
import { msg } from "./msg"

class Database {
    constructor() {
        const database = new Sequelize("sqlite:./database.sqlite", {
            logging: log => {
                msg.debug("sql", log)
            }
        })
        this.database = database
        const guild = database.define('guild', {
            id: {
                unique: true,
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true,
            },
            guildUserData: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "{}"
            },
            guildData: {
                type: DataTypes.STRING,
            }
        })
        const user = database.define('user', {
            id: {
                type: DataTypes.STRING,
                unique: true,
                primaryKey: true,
                allowNull: false
            },
            allowUsage: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            data: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "{}"
            }
        });

        (async () => {
            await database.sync();
            this.user = user
            this.guild = guild
            this.database = database
            
          })();

    }
    database: Sequelize
    public user
    public guild

}

export {Database}