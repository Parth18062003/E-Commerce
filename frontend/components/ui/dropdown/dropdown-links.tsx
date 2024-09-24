import React from 'react'
import { Dropdown, Tabs, Tab, TriggerWrapper, Trigger } from './dropdown'
import { MoveUpRight } from 'lucide-react'

export const DropdownLinks = () => {
  return (
    <div className="">
      <Dropdown>
        <TriggerWrapper>
          <Trigger>Services</Trigger>
          <Trigger>Components</Trigger>
          <Trigger>Blog</Trigger>
        </TriggerWrapper>
        <Tabs>
          <Tab>
            <OurServices />
          </Tab>
          <Tab>
            <Components />
          </Tab>
          <Tab>
            <Blog />
          </Tab>
        </Tabs>
      </Dropdown>
    </div>
  )
}

const OurServices = () => (
  <div className="flex gap-4 p-4 w-full h-full">
    <div
      className={
        'text-white font-bold text-3xl flex items-end justify-start p-4 w-56 h-[200px] rounded-md bg-gradient-to-br [background-size:150%] from-orange-400 via-fuchsia-600 to-cyan-400'
      }
    >
      We <br /> Create
    </div>
    <div className={'flex flex-col gap-3'}>
      <div>
        <h3 className={'dark:text-white text-zinc-950'}>Websites</h3>
        <p className={'text-zinc-500 text-sm'}>
          Interactive, beautiful and user friendly websites
        </p>
      </div>
      <div>
        <h3 className={'dark:text-white text-zinc-950'}>Components</h3>
        <p className={'text-zinc-500 text-sm'}>Animated and colorful components</p>
      </div>
      <div>
        <h3 className={'dark:text-white text-zinc-950'}>SaaS</h3>
        <p className={'text-zinc-500 text-sm'}>
          Useful Software as a Service products which people love
        </p>
      </div>
    </div>
  </div>
)

const Components = () => (
  <div className="grid grid-cols-2 gap-4 p-4 ">
    <span
      className={'hover:dark:bg-zinc-900 hover:bg-zinc-100 p-3 rounded-md transition-colors'}
    >
      <h3 className={'dark:text-white text-zinc-950'}>Animated Charts</h3>
      <p className={'text-zinc-500 text-sm'}>Perfect for websites associated with finance</p>
    </span>
    <span
      className={'hover:dark:bg-zinc-900 hover:bg-zinc-100 p-3 rounded-md transition-colors'}
    >
      <h3 className={'dark:text-white text-zinc-950'}>Animated Cursor</h3>
      <p className={'text-zinc-500 text-sm'}>Useful for team work illustrations</p>
    </span>
    <span
      className={'hover:dark:bg-zinc-900 hover:bg-zinc-100 p-3 rounded-md transition-colors'}
    >
      <h3 className={'dark:text-white text-zinc-950'}>Tab List</h3>
      <p className={'text-zinc-500 text-sm'}>
        Animated Tab List Menu tailwindCSS and React.js Only
      </p>
    </span>
    <span
      className={'hover:dark:bg-zinc-900 hover:bg-zinc-100 p-3 rounded-md transition-colors'}
    >
      <h3 className={'dark:text-white text-zinc-950'}>Pricing Component</h3>
      <p className={'text-zinc-500 text-sm'}>Neo Brutalist style animated pricing component</p>
    </span>
  </div>
)

const Blog = () => (
  <>
    <div className={'p-4 border-b dark:border-zinc-800'}>
      <div className={'text-sm dark:text-zinc-500 text-zinc-400 px-3'}>info</div>
      <span
        className={
          'block hover:dark:bg-zinc-900 hover:bg-zinc-100 p-3 rounded-md transition-colors w-fit'
        }
      >
        <h3 className={'dark:text-white text-zinc-950 flex items-center gap-1'}>
          Workflow{' '}
          <MoveUpRight className="h-4 w-4 text-indigo-500 dark:text-indigo-300"/>
        </h3>
        <p className={'text-zinc-500 text-sm'}>Check out how we deliver our products</p>
      </span>
    </div>
    <div className={'p-4'}>
      <div className={'text-sm dark:text-zinc-500 text-zinc-400 px-3 pt-0'}>tutorials</div>
      <div className={'flex'}>
        <span
          className={
            'hover:dark:bg-zinc-900 hover:bg-zinc-100 p-3 rounded-md transition-colors'
          }
        >
          <h3 className={'dark:text-white text-zinc-950 flex items-center gap-1'}>
            Animations{' '}
            <MoveUpRight className="h-4 w-4 text-indigo-500 dark:text-indigo-300"/>
          </h3>
          <p className={'text-zinc-500 text-sm'}>
            You will learn how to make fascinating animations
          </p>
        </span>
        <span
          className={
            'hover:dark:bg-zinc-900 hover:bg-zinc-100 p-3 rounded-md transition-colors'
          }
        >
          <h3 className={'dark:text-white text-zinc-950 flex items-center gap-1'}>
            API{' '}
            <MoveUpRight className="h-4 w-4 text-indigo-500 dark:text-indigo-300"/>
          </h3>
          <p className={'text-zinc-500 text-sm'}>
            Learn how to build fast and reliable APIs to deliver data
          </p>
        </span>
      </div>
    </div>
  </>
)
