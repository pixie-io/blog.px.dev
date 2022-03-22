---
path: '/tables-are-hard-2'
title: 'Tables are Hard, Part 2: Building a Simple Data Table in React'
date: 2021-12-14T06:00:00.000+00:00
featured_image: tables-are-hard-2-hero.png
categories: ['Pixie Team Blogs']
authors: ['Nick Lanam']
emails: ['nlanam@pixielabs.ai']
---

Let's build a "simple" data table in a web app, starting with the basics.

In the [previous post](https://blog.px.dev/tables-are-hard-1/), we summarized the features expected in a modern data table.

By the end of this tutorial, we'll build a table with filtering, sorting, and basic column controls.
In the next post, we'll add new requirements and walk through handling them.

This tutorial is aimed at relative beginners to web development, and will keep the set of tools as basic as possible to remain focused. Skip to the end for suggestions for a more serious project.

[Final Code](https://github.com/pixie-io/pixie-demos/tree/main/react-table) | [Live Demo](https://pixie-io.github.io/pixie-demos/react-table)

_This article is part of a series_:
- [Part 1: History](https://blog.px.dev/tables-are-hard-3)
- **Part 2: Building a Simple Data Table in React**
- [Part 3: Streaming Data](https://blog.px.dev/tables-are-hard-3)

::: div image-xl
<figure>
  <video controls muted loop playsinline width="670">
    <source src="tables-are-hard-2-full-demo.mp4" type="video/mp4" />
  </video>
  <figcaption>
    A quick video demonstration of what we'll build.
  </figcaption>
</figure>
:::

## Prerequisites

To follow along with this tutorial, you'll need the following:

* A modern browser. If you're reading this, you probably have one[^1].
* [NodeJS](https://nodejs.org/en/), version &ge;14; npm &ge;5.2 (node 14 comes with npm 6).
* Something to edit code with. We'll use [VS Code](https://code.visualstudio.com/) for this.
* A basic understanding of the command line for your operating system.
* A basic understanding of HTML, CSS, JavaScript, and [React](https://reactjs.org/).

## Setting Up

To begin, let's quickly generate an empty React app with [Create React App](https://create-react-app.dev/docs/getting-started/).
To stay focused, we'll avoid adding any tools or libraries that aren't directly related to React or our table[^2].

1. In a directory of your choice, run `npx create-react-app react-table-demo --use-npm`.
2. This will create the directory `react-table-demo`. `cd` into it.
3. Run `npm start` (you don't need to run `npm install` because `create-react-app` already did it).
4. If it doesn't happen automatically, open your browser to [http://localhost:3000](http://localhost:3000).
5. Don't get hypnotized by the spinning logo.

## Rendering a Grid

With `npm start` still running, we can begin building something.
To get comfortable with the editing experience, we'll create an ordinary table that doesn't do anything special yet.
This means removing most of what's already on the page. We won't be using the spinner.

1. Change the styles in `App.css` to a basic flex container, removing the logo styles.
2. Change `App.js` to just render "Hello, World!" in the middle of the screen.
3. Remove `logo.svg` as we aren't using it anymore.

<tabs>
  <tab label="App.js">
    <code-block language='jsx' code={`
import './App.css';
\n\
function App() {
  return (
    <div className='App'>
      <main>
        Hello, World!
      </main>
    </div>
  );
}
\n\
export default App;
    `}/>
  </tab>
  <tab label='App.css'>
    <github-embed language='css' repo='pixie-io/pixie-demos' srcPath='react-table/1-basics/src/App.css' />
  </tab>
</tabs>

Next, we'll put a basic table in place just to get the ball rolling:

1. Create `src/utils/useData.js`, which generates a random 2D array of data with headers.
2. Create `src/Table.js`, which consumes `useData` and puts it in an HTML `table`.
3. Create `src/Table.module.css` to make it look nice.
4. Use the new `Table` component from `Table.js` in `App.js`

<tabs>
  <tab label='useData.js'>
    <github-embed language='js' repo='pixie-io/pixie-demos' srcPath='react-table/1-basics/src/utils/useData.js' />
  </tab>
  <tab label='Table.js'>
    <github-embed language='js' repo='pixie-io/pixie-demos' srcPath='react-table/1-basics/src/Table.js' />
  </tab>
  <tab label='Table.module.css'>
    <github-embed language='css' repo='pixie-io/pixie-demos' srcPath='react-table/1-basics/src/Table.module.css' />
  </tab>
  <tab label='App.js'>
    <code-block language='diff' code={`
+ import useData from './utils/useData.js';
+ import Table from './Table.js';
\n\
import './App.css';
\n\
function App() {
  const data = useData();
  return (
    <div className=\"App\">
      <main>
-       Hello, World!
+       <Table data={data} />
      </main>
    </div>
  );
}
\n\
export default App;
    `}/>
  </tab>
</tabs>

Now that we're showing tabular data, let's start adding features to make it more useful.

## Enter: `react-table`

We could add features like sorting, filtering, column hiding, and so forth ourselves.

While this isn't especially difficult at first, it gets complicated quickly.
Instead of walking this well-trodden path ourselves, we'll use a library to deal with the common problems: [react-table](https://react-table.tanstack.com/).

Let's convert our simple HTML `<table>` to one that uses `react-table` before we go any further.
Luckily, its creators already wrote and [excellent tutorial](https://react-table.tanstack.com/docs/quick-start) for this part.
To summarize:

1. `npm install react-table`
2. Restart `npm start`
3. Change `useData` in `useData.js` to the format `react-table` expects.
4. Change `Table.js` to setup and call `useTable` with the same data we just adapted.
5. Marvel at how we created the exact same thing with more code.
6. Despair not, because this makes the next parts easier.

<tabs>
  <tab label='useData.js'>
    <github-embed language='js' repo='pixie-io/pixie-demos' srcPath='react-table/2-react-table/src/utils/useData.js' />
  </tab>
  <tab label='Table.js'>
    <code-block language='diff' code={`
 import styles from './Table.module.css'
+import { useTable } from 'react-table';
+
+export default function Table({ data: { columns, data } }) {
+  const reactTable = useTable({ columns, data });
+
+  const {
+    getTableProps,
+    getTableBodyProps,
+    headerGroups,
+    rows,
+    prepareRow
+  } = reactTable;
\n\
-export default function Table({ data: { headers, rows } }) {
   return (
-    <table className={styles.Table}>
+    <table {...getTableProps()} className={styles.Table}>
       <thead>
-        {headers.map(h => <th>{h}</th>)}
-      </thead>
-      <tbody>
-        {rows.map((row) => (
-          <tr>
-            {row.map(cell => <td>{cell}</td>)}
+        {headerGroups.map(group => (
+          <tr {...group.getHeaderGroupProps()}>
+            {group.headers.map(column => (
+              <th {...column.getHeaderProps()}>
+                {column.render('Header')}
+              </th>
+            ))}
           </tr>
         ))}
+      </thead>
+      <tbody {...getTableBodyProps()}>
+        {rows.map((row) => {
+          prepareRow(row);
+          return (
+            <tr {...row.getRowProps()}>
+              {row.cells.map(cell => (
+                <td {...cell.getCellProps()}>
+                  {cell.render('Cell')}
+                </td>
+              ))}
+            </tr>
+          );
+        })}
       </tbody>
     </table>
   );
    `}/>
  </tab>
</tabs>

It looks like this now:

::: div
<iframe width="100%" height="600px" style="border-width: 1px 0 1px 0;border-color: rgba(0, 0, 0, 0.5); border-style:solid;" src="https://pixie-io.github.io/pixie-demos/react-table/2-react-table/build/" />
:::

## Filtering and Sorting

While there is a great [complex example](https://react-table.tanstack.com/docs/examples/filtering) of what `react-table` can do for filtering, we'll start with only a simple global filter.
To use it, we'll create an input that hides every row not containing what the user types. This involves just a few steps:

1. Import the plugin `useGlobalFilter` from `react-table`
2. Pass it as an argument to `useTable`, which adds a `setGlobalFilter` function to the instance returned by `useTable`.
3. Create a `Filter` component, which just calls `setGlobalFilter` as the user types.

While we're here, let's add sorting. This is even easier:

1. Import `useSortBy` from `react-table`, add it to the arguments to `useTable`.
2. In the table header, use the new `column.getSortByToggleProps()` method, which adds click handlers to the headers.
3. Still in the table header, add a simple visual indicator to tell the user what's being used to sort.

Like with filtering, `useSortBy` is [highly configurable](https://react-table.tanstack.com/docs/api/useSortBy).
You can set a default sort state, allow sorting by multiple columns, reset sorting whenever you need to, customize the sorting method, and more.

<tabs>
  <tab label='Table.js'>
    <code-block language='diff' code={`
+import * as React from 'react';
+
 import styles from './Table.module.css'
-import { useTable } from 'react-table';
+import Filter from './Filter.js';
+import { useTable, useGlobalFilter, useSortBy } from 'react-table';
\n\
 export default function Table({ data: { columns, data } }) {
-  const reactTable = useTable({ columns, data });
+  const reactTable = useTable({
+      columns,
+      data
+    },
+    useGlobalFilter,
+    useSortBy
+  );
\n\
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
-    prepareRow
+    prepareRow,
+    setGlobalFilter
   } = reactTable;
\n\
   return (
+    <>
+      <Filter onChange={setGlobalFilter} />
      <table {...getTableProps()} className={styles.Table}>
        <thead>
          {headerGroups.map(group => (
            <tr {...group.getHeaderGroupProps()}>
              {group.headers.map(column => (
-                <th {...column.getHeaderProps()}>
+                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
+                    <span>
+                      {column.isSorted ? (
+                        column.isSortedDesc ? ' 🔽' : ' 🔼'
+                      ): ''}
+                    </span>
                </th>
              ))}
            </tr>
            );
          })}
        </tbody>
      </table>
+    </>
   );
 }
    `}/>
  </tab>
  <tab label='Filter.js'>
    <github-embed language='js' repo='pixie-io/pixie-demos' srcPath='react-table/3-sort-and-filter/src/Filter.js' />
  </tab>
  <tab label='Filter.module.css'>
    <github-embed language='css' repo='pixie-io/pixie-demos' srcPath='react-table/3-sort-and-filter/src/Filter.module.css' />
  </tab>
</tabs>

## Column Controls

Unsurprisingly, `react-table` also has features for column [resizing](https://react-table.tanstack.com/docs/api/useResizeColumns), [hiding](https://react-table.tanstack.com/docs/examples/column-hiding), and [ordering](https://react-table.tanstack.com/docs/api/useColumnOrder).

For column resizing, we need to tell `react-table` how to calculate column widths:

1. Import `useFlexLayout` (or `useBlockLayout`) from `react-table`, add to `useTable`.
2. Same with `useResizeColumns`. Note that this works differently with each layout, and order matters.
3. Like with sorting, add a visual control to each column's header to use resizing. The `useResizeColumns` plugin provides a props getter to handle all the logic for this control.
4. Slightly adjust the HTML and CSS in the `Table` component to prevent the sorting and resizing handles from interfering with each other.

Now for column hiding: this one doesn't need a plugin; `useTable` already sets it up!

1. Create a `ColumnSelector` component, much like we did for `Filter`. It takes the list of all columns from `useTable(...).allColumns` and provides a checkbox for each.
2. The checkbox uses `column.getToggleHiddenProps()` to handle this logic for us.

<tabs>
  <tab label='Table.js'>
    <code-block language='diff' code={`
 import * as React from 'react';
 \n\
 import styles from './Table.module.css'
 import Filter from './Filter.js';
-import { useTable, useGlobalFilter, useSortBy } from 'react-table';
+import ColumnSelector from './ColumnSelector.js';
+import {
+  useTable,
+  useFlexLayout,
+  useGlobalFilter,
+  useSortBy,
+  useResizeColumns,
+} from 'react-table';
 \n\
 export default function Table({ data: { columns, data } }) {
   const reactTable = useTable({
       columns,
       data
     },
+    useFlexLayout,
     useGlobalFilter,
-    useSortBy
+    useSortBy,
+    useResizeColumns
   );
\n\
   const {
     getTableProps,
     getTableBodyProps,
     headerGroups,
     rows,
+    allColumns,
     prepareRow,
     setGlobalFilter
   } = reactTable;
\n\
   return (
     <>
+      <ColumnSelector columns={allColumns} />
       <Filter onChange={setGlobalFilter} />
       <table {...getTableProps()} className={styles.Table}>
         <thead>
           {headerGroups.map(group => (
             <tr {...group.getHeaderGroupProps()}>
               {group.headers.map(column => (
-                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
-                  {column.render('Header')}
-                  <span>
-                    {column.isSorted ? (
-                      column.isSortedDesc ? ' 🔽' : ' 🔼'
-                    ): ''}
-                  </span>
+                <th {...column.getHeaderProps()}>
+                  <div {...column.getSortByToggleProps()}>
+                    {column.render('Header')}
+                    <span>
+                      {column.isSorted ? (
+                        column.isSortedDesc ? ' 🔽' : ' 🔼'
+                      ): ''}
+                    </span>
+                  </div>
+                  <div {...column.getResizerProps()} className={[styles.ResizeHandle, column.isResizing && styles.ResizeHandleActive].filter(x=>x).join(' ')}>
+                    &#x22EE;
+                  </div>
                 </th>
               ))}
             </tr>
           ))}
         </thead>
         <tbody {...getTableBodyProps()}>
           {rows.map((row) => {
             prepareRow(row);
             return (
               <tr {...row.getRowProps()}>
                 {row.cells.map(cell => (
                   <td {...cell.getCellProps()}>
                     {cell.render('Cell')}
                   </td>
                 ))}
               </tr>
             );
           })}
         </tbody>
       </table>
     </>
   );
 }
    `}/>
  </tab>
  <tab label='Table.module.css'>
    <code-block language='diff' code={`
.Table {
   font-size: 1rem;
   text-align: left;
   border-collapse: collapse;
   width: 100%;
 }
\n\
 .Table td, .Table th {
   line-height: 2em;
   padding: 0 0.75em;
   border: 1px rgba(255, 255, 255, 0.75) solid;
+  text-overflow: ellipsis;
+  white-space: nowrap;
+  overflow: hidden;
+  min-width: 2rem;
 }
\n\
 .Table th {
+  max-height: 3.5em;
   padding: 0.75em 0.75em;
   border-bottom-width: 2px;
+  position: relative;
+}
+
+.ResizeHandle {
+  user-select: none;
+  display: inline-block;
+  position: absolute;
+  top: 50%;
+  right: 0;
+  transform: translate(0, -50%);
+  opacity: 0.8;
+}
+
+.ResizeHandleActive {
+  opacity: 1;
 }
    `}/>
  </tab>
  <tab label='ColumnSelector.js'>
    <github-embed language='js' repo='pixie-io/pixie-demos' srcPath='react-table/4-column-controls/src/ColumnSelector.js' />
  </tab>
  <tab label='ColumnSelector.module.css'>
    <github-embed language='css' repo='pixie-io/pixie-demos' srcPath='react-table/4-column-controls/src/ColumnSelector.module.css' />
  </tab>
</tabs>

Although column ordering also has a plugin, it doesn't provide props for easy controls like the others. As such, we'll skip it for this tutorial.

Here's what it looks like so far (click to interact):

::: div
<iframe width="100%" height="600px" style="border-width: 1px 0 1px 0;border-color: rgba(0, 0, 0, 0.5); border-style:solid;" src="https://pixie-io.github.io/pixie-demos/react-table/4-column-controls/build/" />
:::

## Fancy Cells

So far we've added a bunch of features, but the data itself is still showing as plain text.
What if we want to color scores by their value, or right-align IDs? Well, `react-table` has us covered here too.
Column definitions can include a `Cell` function (in fact, `Header` can be a function too) which returns anything that's valid JSX. That is, these can be React components.

<tabs>
  <tab label='useData.js'>
    <code-block language='diff' code={`
 import * as React from 'react';
 \n\
 function randomFrom(array) {
   return array[Math.floor(Math.random() * array.length)];
 }
 \n\
 /** Make a silly word that rhymes with Goomba (the Mario mushroom enemies) */
 function sillyWord() {
   const leadConsonants = ['B', 'D', 'F', 'G', 'L', 'T', 'V', 'Z'];
   const middles = ['oom', 'oon', 'um', 'un'];
   const midConsonants = ['b', 'd']
   const ends = ['a', 'ah', 'u', 'uh', 'o'];
\n\
   const word = randomFrom(leadConsonants) + randomFrom(middles) + randomFrom(midConsonants) + randomFrom(ends);
\n\
   // Try again if we accidentally picked something offensive
   if (['Goombah'].includes(word)) return sillyWord();
   else return word;
 }
\n\
 function sillyName() {
   return \`\${sillyWord()} \${sillyWord().substring(0, 3)}\`;
 }
\n\
 const genericHeaders = ['ID', 'Name', 'Friend', 'Score', 'Temperament'];
 const genericDataFuncs = [
   () => Math.ceil(Math.random() * 100),
   sillyName,
   sillyWord,
   () => Math.floor(Math.random() * 10_000) / 100,
   () => randomFrom(['Goofy', 'Wacky', 'Silly', 'Funny', 'Serious']),
 ];
+const fancyCellRenderers = [
+  function IdCell({ value }) {
+    return <>{value}</>;
+  },
+  function NameCell({ value }) {
+    return <strong>{value}</strong>;
+  },
+  function WordCell({ value }) {
+    return <span style={{ fontStyle: 'italic' }}>{value}</span>
+  },
+  function ScoreCell({ value }) {
+    const color = value < 50 ? 'pink' : 'aquamarine';
+    return <span style={{ color }}>{value}</span>;
+  },
+  function TemperamentCell({value}) {
+    return <>{value}</>;
+  },
+];
\n\
 // react-table expects memoized columns and data, so we export a React hook to permit doing that.
 export default function useData(numRows = 20, numCols = 5) {
   const columns = React.useMemo(() => (
     Array(numCols).fill(0).map((_, h) => {
       const name = genericHeaders[h % genericHeaders.length];
       const id = \`col\${h}\`;
       return {
         Header: name,
+        Cell: fancyCellRenderers[h % fancyCellRenderers.length],
         accessor: id
       };
     })
   ), [numCols]);
\n\
   const data = React.useMemo(() => (
     Array(numRows).fill(0).map(() => {
       const row = {};
       for (let c = 0; c < numCols; c++) {
         row[\`col\${c}\`] = genericDataFuncs[c % genericDataFuncs.length]();
       }
       return row;
     })
   ), [numRows, numCols]);
\n\
   return { columns, data };
 }
    `}/>
  </tab>
</tabs>

With this feature, our demo is largely complete (click to interact):

::: div
<iframe width="100%" height="600px" style="border-width: 1px 0 1px 0;border-color: rgba(0, 0, 0, 0.5); border-style:solid;" src="https://pixie-io.github.io/pixie-demos/react-table/5-fancy-cells/build/" />
:::

## Next Steps

We now have a table that can do the following:

* Render rich data in a grid
* Sort and filter that data
* Resize and show/hide columns
* Ready to configure for more advanced use cases

There's an elephant in the room that we didn't address: dynamic data.
When there are too many rows to render at once, and when the rows change rapidly, how do you sort correctly?
How do you filter correctly? How do you prevent CPU and memory usage from exploding (spoiler: `react-table` wasn't designed for this)?
We'll explore this and more in the [next post](https://blog.px.dev/tables-are-hard-3/).

[^1]: Chrome, Firefox, Edge, Safari, Opera, Brave, etc. [Lynx](https://en.wikipedia.org/wiki/Lynx_(web_browser)) gets nerd cred, but it isn't what we mean here.
[^2]: In a real project, we'd be using Yarn to manage packages; something like Material or styled-components to make editing styles more pleasant; TypeScript for its many benefits, and more. But this is a simple tutorial, so we're adding as few layers of complexity as we can.
