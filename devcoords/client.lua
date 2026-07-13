--[[
    client.lua
    Toggle the coords panel with /coords or F6.
    While open, it updates every frame and sends the values to the NUI
    panel, which has copy buttons for Vector2 / Vector3 / Vector4.
]]

local isOpen = false

local function round(n, decimals)
    local mult = 10 ^ (decimals or 2)
    return math.floor(n * mult + 0.5) / mult
end

local function toggleUI(state)
    isOpen = state
    SetNuiFocus(state, state) -- true = show + free the mouse cursor while the panel is open
    SendNUIMessage({
        action = state and "open" or "close"
    })
end

-- Command + keybind to toggle
RegisterCommand("coords", function()
    toggleUI(not isOpen)
end, false)

RegisterKeyMapping("coords", "Toggle Coords Panel", "keyboard", "F6")

-- Update loop, only runs while the panel is open
CreateThread(function()
    while true do
        if isOpen then
            local ped = PlayerPedId()
            local coords = GetEntityCoords(ped)
            local heading = GetEntityHeading(ped)

            local x, y, z = round(coords.x), round(coords.y), round(coords.z)
            local w = round(heading) -- using heading as the 4th component

            SendNUIMessage({
                action = "update",
                vector2 = string.format("vector2(%s, %s)", x, y),
                vector3 = string.format("vector3(%s, %s, %s)", x, y, z),
                vector4 = string.format("vector4(%s, %s, %s, %s)", x, y, z, w)
            })

            Wait(100) -- 10x/sec is plenty for a display panel
        else
            Wait(500)
        end
    end
end)

-- Let the NUI close itself (e.g. an in-panel close button)
RegisterNUICallback("close", function(_, cb)
    toggleUI(false)
    cb("ok")
end)
