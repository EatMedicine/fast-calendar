using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using fast_calendar_background.Models;

namespace fast_calendar_background.Controllers
{
    public class ToDoListsController : ApiController
    {
        private FastCalendarEntities db = new FastCalendarEntities();

        // GET: api/ToDoLists
        public IQueryable<ToDoList> GetToDoList()
        {
            return db.ToDoList;
        }

        // GET: api/ToDoLists/5
        [ResponseType(typeof(ToDoList))]
        public IHttpActionResult GetToDoList(int id)
        {
            UserLogin user = db.UserLogin.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            var toDoList = db.ToDoList.Where(item => item.userId == id).OrderBy(item=>item.DoDate);

            return Ok(toDoList);
        }

        // PUT: api/ToDoLists/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutToDoList(int id, ToDoList toDoList)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != toDoList.id)
            {
                return BadRequest();
            }

            db.Entry(toDoList).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ToDoListExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ToDoLists
        [ResponseType(typeof(ToDoList))]
        public IHttpActionResult PostToDoList(ToDoList toDoList)
        {
            if (toDoList.IsShow == 1 && toDoList.DoDate == null)
            {
                return BadRequest();
            }
            if (toDoList.IsShow == 0)
            {
                toDoList.DoDate = new DateTime(1970,1,1);
            }
            db.ToDoList.Add(toDoList);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = toDoList.id }, toDoList);
        }

        // DELETE: api/ToDoLists/5
        [ResponseType(typeof(ToDoList))]
        public IHttpActionResult DeleteToDoList(int id)
        {
            ToDoList toDoList = db.ToDoList.Find(id);
            if (toDoList == null)
            {
                return NotFound();
            }

            db.ToDoList.Remove(toDoList);
            db.SaveChanges();

            return Ok(toDoList);
        }

        // Put: api/ToDoLists/disable
        [ResponseType(typeof(ToDoList))]
        [Route("api/ToDoLists/disable")]
        [HttpPut]
        public IHttpActionResult disable(ToDoList toDoList)
        {
            ToDoList dbToDo = db.ToDoList.Find(toDoList.id);
            if (dbToDo == null)
            {
                return BadRequest();
            }
            dbToDo.IsDisable = 1;
            db.SaveChanges();
            return Ok(dbToDo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ToDoListExists(int id)
        {
            return db.ToDoList.Count(e => e.id == id) > 0;
        }
    }
}