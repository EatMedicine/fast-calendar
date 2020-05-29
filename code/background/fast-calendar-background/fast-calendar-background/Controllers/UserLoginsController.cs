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
    public class UserLoginsController : ApiController
    {
        private FastCalendarEntities db = new FastCalendarEntities();

        // GET: api/UserLogins
        public IQueryable<UserLogin> GetUserLogin()
        {
            return db.UserLogin;
        }

        // GET: api/UserLogins/5
        [ResponseType(typeof(UserLogin))]
        public IHttpActionResult GetUserLogin(int id)
        {
            UserLogin userLogin = db.UserLogin.Find(id);
            if (userLogin == null)
            {
                return NotFound();
            }
            userLogin.UserPassword = "";
            return Ok(userLogin);
        }

        // PUT: api/UserLogins/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUserLogin(int id, UserLogin userLogin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userLogin.id)
            {
                return BadRequest();
            }

            db.Entry(userLogin).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserLoginExists(id))
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

        // POST: api/UserLogins
        [ResponseType(typeof(UserLogin))]
        public IHttpActionResult PostUserLogin(UserLogin userLogin)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.UserLogin.Add(userLogin);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userLogin.id }, userLogin);
        }

        // DELETE: api/UserLogins/5
        [ResponseType(typeof(UserLogin))]
        public IHttpActionResult DeleteUserLogin(int id)
        {
            UserLogin userLogin = db.UserLogin.Find(id);
            if (userLogin == null)
            {
                return NotFound();
            }

            db.UserLogin.Remove(userLogin);
            db.SaveChanges();

            return Ok(userLogin);
        }

        [Route("api/UserLogins/Check")]
        [HttpGet]
        public IHttpActionResult Check([FromUri] string  UserName,[FromUri] string UserPassword)
        {
            UserLogin user = db.UserLogin.Where(item => item.UserName == UserName).FirstOrDefault();
            if (user == null)
            {
                return NotFound();
            }
            if(user.UserPassword != UserPassword)
            {
                return BadRequest();
            }
            user.UserPassword = "";

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserLoginExists(int id)
        {
            return db.UserLogin.Count(e => e.id == id) > 0;
        }
    }
}