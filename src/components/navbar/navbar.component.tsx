import useDragula from "@/crafts/UAV/DRAGULA/dragula";
import usePageStore from "@/store/page.store";
import { Avatar, Tab, Tabs, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { fetch, ResponseType } from "@tauri-apps/api/http";
import { exit } from '@tauri-apps/api/process';

const NavbarComponent = () => {

    const { ports, port } = useDragula();

    const { page, setPage }: any = usePageStore();

    const setPort = async (port: string) => {
        let response = await fetch("http://127.0.0.1:5000/setport", {
            method: "POST",
            timeout: 2,
            responseType: ResponseType.JSON,
            body: {
                type: "Json",
                payload: {
                    port
                }
            }
        })
    }



    return (
        <div
            className="text-white w-full flex justify-between items-center"
        >
            <div>
                <Tabs
                    className="rounded-xl"
                    onSelectionChange={setPage}
                >
                    <Tab
                        className="bg-[#1a1a1a]"
                        key="map"
                        title="Карта"
                    >
                    </Tab>
                    <Tab
                        className="bg-[#1a1a1a]"
                        key="camera"
                        title="Камера"
                    >
                    </Tab>
                    <Tab
                        className="bg-[#1a1a1a]"
                        key="devices"
                        title="Устройства"
                    >
                    </Tab>
                    <Tab
                        className="bg-[#1a1a1a]"
                        key="settings"
                        title="Настройки"
                    >
                    </Tab>
                </Tabs>
            </div>

            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <div
                        className="bg-[#1a1a1a] rounded-xl flex items-center gap-3  py-1 px-4"
                    >
                        <div
                            className="flex flex-col items-end my-1"
                        >
                            <div
                                className="text-md m-0 p-0"
                            >
                                VAKOLUPAEV
                            </div>
                            <div
                                className="text-[#505050] text-sm m-0 p-0 text"
                            >
                                {/* online */}
                                {port == " " ? "DISCONNECTED" : port}
                            </div>

                        </div>
                        <Avatar
                            className="cursor-pointer"
                            src="https://sun1-91.userapi.com/s/v1/if2/j86ty5xGLj6LUi7-l8YjlLtk6nc4KhmMVqxh3f3ehneR3dRPiNt3Oj-53CqQ-pmvsl4do8qB59NF-MMuqcD2HM00.jpg?quality=95&crop=0,0,1920,1920&as=50x50,100x100,200x200,400x400&ava=1&u=vcL25iTuP6q4xlr5GhcQMY65jy2sumrSs-J9AkNQjzk&cs=400x400"
                            isBordered
                            color="success"
                            size="md"
                        />

                    </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    {
                        [
                            ...ports.map((port, index) =>
                                <DropdownItem onClick={() => setPort(port)} key={index}>
                                    {port == " " ? "Disconnect" : port}
                                </DropdownItem>),
                            <DropdownItem color="danger" key={-1} onClick={async () => await exit()}>
                                Log Out
                            </DropdownItem>
                        ]
                    }

                </DropdownMenu>
            </Dropdown>

        </div >
    )
}

export default NavbarComponent;