module.exports = (sequelize, DataTypes) => {
    const Report = sequelize.define('Report', {
        userId: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        longitude: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        latitude: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })
    return Report
}